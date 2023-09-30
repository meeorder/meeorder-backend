import { ChartDataDailyDto } from '@/dashboard/dto/chartData.daily.dto';
import { ChartDataMonthlyDto } from '@/dashboard/dto/chartData.monthly.dto';
import { GetUserAmountDto } from '@/dashboard/dto/getAllUserAmount.dto';
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

  async getAllYearlyNetIncome(): Promise<ChartDataMonthlyDto[]> {
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
        month: +new Date(item._id.year),
        netIncome: item.total_price - item.discount_price,
      };
    });
  }

  // To be continued
  async getAllGroupedNetIncome(startTime: Date, endTime: Date) {
    console.log(startTime, endTime);
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
    return agg.map((item) => {
      console.log(item);
      return {
        dayOfWeek: item.dayOfWeek,
        netIncome: item.total_price - item.discount_price,
      };
    });
  }
}
