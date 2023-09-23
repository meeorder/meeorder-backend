import { GetUserAmountDto } from '@/dashboard/dto/getAllUserAmount.dto';
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
    return {
      total_user: total,
      old_user: calculate[0].count,
      new_user: total - calculate[0].count,
    };
  }
}
