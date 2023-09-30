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
    @InjectModel(ReceiptSchema)
    private readonly receiptModel: ReturnModelType<typeof ReceiptSchema>,
    private readonly userService: UsersService,
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
}
