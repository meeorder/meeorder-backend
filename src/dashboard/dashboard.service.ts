import { GetReceiptAmountDto } from '@/dashboard/dto/getAllReceiptAmount.dto';
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

  async getAllReceiptAmount(date: Date): Promise<GetReceiptAmountDto> {
    let receipt_no_user = 0;

    const no_receipt_user = await this.receiptModel.aggregate([
      {
        $match: {
          created_at: { $gte: date },
        },
      },
      {
        $lookup: {
          from: 'sessions',
          localField: 'session',
          foreignField: '_id',
          as: 'session',
        },
      },
      {
        $match: {
          'session.user': null,
        },
      },
      {
        $group: {
          _id: '$session.user',
          total: {
            $sum: 1,
          },
        },
      },
    ]);

    if (no_receipt_user.length > 0) {
      receipt_no_user = no_receipt_user[0].total;
    }

    const receipt_all = await this.receiptModel.countDocuments({
      created_at: { $gte: date },
    });

    const all_receipt = receipt_all;
    const receipt_user = receipt_all - receipt_no_user;

    return {
      all_receipt,
      receipt_user,
      receipt_no_user,
    };
  }

  async getIncomeReport(date: Date) {
    const data = await this.receiptModel.aggregate([
      {
        $match: {
          created_at: { $gte: date },
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

  async getCouponReportToday(date: Date) {
    const numberOfCouponUsageToday = await this.receiptModel
      .aggregate([
        {
          $match: {
            created_at: { $gte: date },
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
