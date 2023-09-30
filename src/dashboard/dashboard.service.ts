import { ChartDataDailyDto } from '@/dashboard/dto/chartData.daily.dto';
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
      console.log(item);
      return {
        date: +new Date(item._id.date),
        netIncome: item.total_price - item.discount_price,
      };
    });
  }
}
