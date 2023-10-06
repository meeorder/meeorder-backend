import { ChartDataDailyDto } from '@/dashboard/dto/chartData.daily.dto';
import { ChartDataMonthlyDto } from '@/dashboard/dto/chartData.monthly.dto';
import { ChartDataYearlyDto } from '@/dashboard/dto/chartData.yearly.dto';
import { DaysOfWeekSubDto } from '@/dashboard/dto/daysOfWeek.sub.dto';
import { GetUserAmountDto } from '@/dashboard/dto/getAllUserAmount.dto';
import { HourlySubDto } from '@/dashboard/dto/hourly.sub.dto';
import { MonthlySubDto } from '@/dashboard/dto/monthly.sub.dto';
import { QuarterlySubDto } from '@/dashboard/dto/quarterly.sub.dto';
import { ReceiptSchema } from '@/schema/receipt.schema';
import { UserSchema } from '@/schema/users.schema';
import { UsersService } from '@/users/users.service';
import { Injectable } from '@nestjs/common';
import { ReturnModelType } from '@typegoose/typegoose';
import { InjectModel } from 'nest-typegoose';

@Injectable()
export class DashboardService {
  constructor(
    @InjectModel(UserSchema)
    private readonly userModel: ReturnModelType<typeof UserSchema>,
    @InjectModel(ReceiptSchema)
    private readonly receiptModel: ReturnModelType<typeof ReceiptSchema>,
    private readonly userService: UsersService,
    @InjectModel(ReceiptSchema)
    private readonly receiptModel: ReturnModelType<typeof ReceiptSchema>,
  ) {}

  async getAllUserAmount(date: Date): Promise<GetUserAmountDto> {
    const calculate = await this.userModel.aggregate([
      {
        $match: { _id: { $exists: true }, role: 1, created_at: { $lte: date } },
      },
      {
        $group: { _id: null, count: { $sum: 1 } },
      },
    ]);

    const total = await this.userModel.countDocuments({
      deleted_at: null,
      role: 1,
    });

    const old_user = calculate[0].count;

    return {
      total_user: total,
      old_user,
      new_user: total - old_user,
    };
  }

  async getIncomeReport(date_from: Date, date_end: Date) {
    console.log(date_from, date_end);
    const data = await this.receiptModel.aggregate([
      {
        $match: {
          created_at: { $gte: date_from, $lte: date_end },
        },
      },
      {
        $group: {
          _id: null,
          totalIncome: {
            $sum: '$total_price',
          },
          totalDiscount: {
            $sum: '$discount_price',
          },
        },
      },
    ]);

    let netIncome = 0;
    let totalIncome = 0;
    let totalDiscount = 0;

    if (data.length !== 0) {
      netIncome = data[0].totalIncome - data[0].totalDiscount;
      totalIncome = data[0].totalIncome;
      totalDiscount = data[0].totalDiscount;
    }

    return {
      netIncome,
      totalIncome,
      totalDiscount,
    };
  }

  async getAllDailyNetIncome(): Promise<ChartDataDailyDto[]> {
    const agg = await this.receiptModel.aggregate([
      {
        $group: {
          _id: {
            date: {
              $dateToString: { format: '%Y-%m-%d', date: '$created_at' },
            },
          },
          total_price: { $sum: '$total_price' },
          discount_price: { $sum: '$discount_price' },
        },
      },
    ]);
    return agg.map((item) => {
      return {
        date: +new Date(item._id.date),
        netIncome: item.total_price - item.discount_price,
      };
    });
  }

  async getAllMonthlyNetIncome(): Promise<ChartDataMonthlyDto[]> {
    const agg = await this.receiptModel.aggregate([
      {
        $group: {
          _id: {
            month: {
              $dateToString: { format: '%Y-%m', date: '$created_at' },
            },
          },
          total_price: { $sum: '$total_price' },
          discount_price: { $sum: '$discount_price' },
        },
      },
    ]);
    return agg.map((item) => {
      return {
        month: +new Date(item._id.month),
        netIncome: item.total_price - item.discount_price,
      };
    });
  }

  async getAllYearlyNetIncome(): Promise<ChartDataYearlyDto[]> {
    const agg = await this.receiptModel.aggregate([
      {
        $group: {
          _id: {
            year: {
              $dateToString: { format: '%Y', date: '$created_at' },
            },
          },
          total_price: { $sum: '$total_price' },
          discount_price: { $sum: '$discount_price' },
        },
      },
    ]);
    return agg.map((item) => {
      return {
        year: +new Date(item._id.year),
        netIncome: item.total_price - item.discount_price,
      };
    });
  }

  // All grouped net income
  async getDayGroupedNetIncome(startTime: Date, endTime: Date) {
    const days = { Sun: 1, Mon: 2, Tue: 3, Wed: 4, Thu: 5, Fri: 6, Sat: 7 };
    const agg = await this.receiptModel.aggregate([
      {
        $match: {
          created_at: {
            $gte: startTime,
            $lte: endTime,
          },
        },
      },
      {
        $group: {
          _id: {
            dayOfWeek: { $dayOfWeek: '$created_at' },
          },
          total_price: { $sum: '$total_price' },
          discount_price: { $sum: '$discount_price' },
        },
      },
      {
        $project: {
          total_price: 1,
          discount_price: 1,
          _id: 1,
          dayOfWeek: {
            $switch: {
              branches: [
                { case: { $eq: ['$_id.dayOfWeek', days.Sun] }, then: 'Sun' },
                { case: { $eq: ['$_id.dayOfWeek', days.Mon] }, then: 'Mon' },
                { case: { $eq: ['$_id.dayOfWeek', days.Tue] }, then: 'Tue' },
                { case: { $eq: ['$_id.dayOfWeek', days.Wed] }, then: 'Wed' },
                { case: { $eq: ['$_id.dayOfWeek', days.Thu] }, then: 'Thu' },
                { case: { $eq: ['$_id.dayOfWeek', days.Fri] }, then: 'Fri' },
                { case: { $eq: ['$_id.dayOfWeek', days.Sat] }, then: 'Sat' },
              ],
              default: 'Unknown',
            },
          },
        },
      },
    ]);
    const dto = new DaysOfWeekSubDto();
    agg.forEach((item) => {
      dto[item.dayOfWeek] = item.total_price - item.discount_price;
    });
    return dto;
  }

  async getHourGroupedNetIncome(startTime: Date, endTime: Date) {
    const agg = await this.receiptModel.aggregate([
      {
        $match: {
          created_at: {
            $gte: startTime,
            $lte: endTime,
          },
        },
      },
      {
        $group: {
          _id: {
            hour: { $hour: '$created_at' },
          },
          total_price: { $sum: '$total_price' },
          discount_price: { $sum: '$discount_price' },
        },
      },
      {
        $project: {
          total_price: 1,
          discount_price: 1,
          _id: 1,
          hour: '$_id.hour',
        },
      },
    ]);
    const dto = new HourlySubDto();
    agg.forEach((item) => {
      dto[item.hour] = item.total_price - item.discount_price;
    });
    return dto;
  }

  async getMonthGroupedNetIncome(startTime: Date, endTime: Date) {
    const month = {
      Jan: 1,
      Feb: 2,
      Mar: 3,
      Apr: 4,
      May: 5,
      Jun: 6,
      Jul: 7,
      Aug: 8,
      Sep: 9,
      Oct: 10,
      Nov: 11,
      Dec: 12,
    };
    const agg = await this.receiptModel.aggregate([
      {
        $match: {
          created_at: {
            $gte: startTime,
            $lte: endTime,
          },
        },
      },
      {
        $group: {
          _id: {
            month: { $month: '$created_at' },
          },
          total_price: { $sum: '$total_price' },
          discount_price: { $sum: '$discount_price' },
        },
      },
      {
        $project: {
          total_price: 1,
          discount_price: 1,
          _id: 1,
          month: {
            $switch: {
              branches: [
                { case: { $eq: ['$_id.month', month.Jan] }, then: 'Jan' },
                { case: { $eq: ['$_id.month', month.Feb] }, then: 'Feb' },
                { case: { $eq: ['$_id.month', month.Mar] }, then: 'Mar' },
                { case: { $eq: ['$_id.month', month.Apr] }, then: 'Apr' },
                { case: { $eq: ['$_id.month', month.May] }, then: 'May' },
                { case: { $eq: ['$_id.month', month.Jun] }, then: 'Jun' },
                { case: { $eq: ['$_id.month', month.Jul] }, then: 'Jul' },
                { case: { $eq: ['$_id.month', month.Aug] }, then: 'Aug' },
                { case: { $eq: ['$_id.month', month.Sep] }, then: 'Sep' },
                { case: { $eq: ['$_id.month', month.Oct] }, then: 'Oct' },
                { case: { $eq: ['$_id.month', month.Nov] }, then: 'Nov' },
                { case: { $eq: ['$_id.month', month.Dec] }, then: 'Dec' },
              ],
              default: 'Unknown',
            },
          },
        },
      },
    ]);
    const dto = new MonthlySubDto();
    agg.forEach((item) => {
      dto[item.month] = item.total_price - item.discount_price;
    });
    return dto;
  }

  async getQuarterGroupedNetIncome(startTime: Date, endTime: Date) {
    const three = 3;
    const agg = await this.receiptModel.aggregate([
      {
        $match: {
          created_at: {
            $gte: startTime,
            $lte: endTime,
          },
        },
      },
      {
        $group: {
          _id: {
            quarter: {
              $ceil: {
                $divide: [{ $subtract: [{ $month: '$created_at' }, 1] }, three],
              },
            },
          },
          total_price: { $sum: '$total_price' },
          discount_price: { $sum: '$discount_price' },
        },
      },
      {
        $project: {
          total_price: 1,
          discount_price: 1,
          _id: 1,
          quarter: '$_id.quarter',
        },
      },
    ]);
    const dto = new QuarterlySubDto();
    agg.forEach((item) => {
      dto['Q' + item.quarter.toString()] =
        item.total_price - item.discount_price;
    });
    return dto;
  }
}
