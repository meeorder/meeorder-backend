import { MongoTransform } from '@/utils/mongo-transform';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { Types } from 'mongoose';

export class UpdateSessionCouponDto {
  @ApiProperty({ type: String, description: 'Coupon ID', nullable: true })
  @Transform(new MongoTransform(true).value())
  coupon_id: Types.ObjectId;
}
