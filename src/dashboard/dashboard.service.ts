import { GetUserAmountDto } from '@/dashboard/dto/getAllUserAmount.dto';
import { CouponSchema } from '@/schema/coupons.schema';
import { ReceiptSchema } from '@/schema/receipt.schema';
import { UserSchema } from '@/schema/users.schema';
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
    @InjectModel(CouponSchema)
    private readonly couponModel: ReturnModelType<typeof CouponSchema>,
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

    let old_user = 0;

    if (calculate.length !== 0) {
      old_user = calculate[0].count;
    }

    return {
      total_user: total,
      old_user,
      new_user: total - old_user,
    };
  }

  async getIncomeReport(date_from: Date, date_end: Date) {
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

  async getCouponReportToday() {
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);

    const numberOfCouponUsageToday = await this.receiptModel
      .aggregate([
        {
          $match: {
            created_at: { $gte: currentDate },
          },
        },
        {
          $count: 'totalCouponUsage',
        },
      ])
      .exec();

    let couponUsageToday = 0;
    if (numberOfCouponUsageToday.length !== 0) {
      couponUsageToday = numberOfCouponUsageToday[0].totalCouponUsage;
    }

    return couponUsageToday;
  }

  async getCouponReportTotal() {
    const numberOfCouponUsageTotal = await this.receiptModel
      .aggregate([
        {
          $count: 'totalCouponUsage',
        },
      ])
      .exec();
    const couponQuota = await this.couponModel.countDocuments({
      deleted_at: null,
    });

    let couponUsageTotal = 0;
    if (numberOfCouponUsageTotal.length !== 0) {
      couponUsageTotal = numberOfCouponUsageTotal[0].totalCouponUsage;
    }

    return {
      couponUsageTotal,
      couponQuota,
    };
  }
}
