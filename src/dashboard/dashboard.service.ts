import { GetUserAmountDto } from '@/dashboard/dto/getAllUserAmount.dto';
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
  ) {}

  async getAllRecieptAmount(date: Date): Promise<GetUserAmountDto> {
    let reciept_no_user = 0;

    const no_reciept_user = await this.receiptModel.aggregate([
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

    if (no_reciept_user.length > 0) {
      reciept_no_user = no_reciept_user[0].total;
    }

    const reciept_all = await this.receiptModel.countDocuments({
      created_at: { $gte: date },
    });

    const all_reciept = reciept_all;
    const reciept_user = reciept_all - reciept_no_user;

    return {
      all_reciept,
      reciept_user,
      reciept_no_user,
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
}
