import { AllPopulatedOrderDto } from '@/orders/dto/all-populated-order.dto';
import { CouponSchema } from '@/schema/coupons.schema';
import { UserSchema } from '@/schema/users.schema';
import { ApiProperty } from '@nestjs/swagger';
import { Types } from 'mongoose';

export class AllPopulatedSessionDto {
  @ApiProperty({ type: String })
  _id: string | Types.ObjectId;

  @ApiProperty({ type: Date })
  created_at: Date;

  @ApiProperty({ type: Date })
  finished_at: Date;

  @ApiProperty({ type: () => UserSchema, nullable: true })
  user: UserSchema;

  @ApiProperty({ type: () => CouponSchema, nullable: true })
  coupon: CouponSchema;

  @ApiProperty({ type: String })
  table: string | Types.ObjectId;

  @ApiProperty({ type: () => AllPopulatedOrderDto, isArray: true })
  orders: AllPopulatedOrderDto[];
}
