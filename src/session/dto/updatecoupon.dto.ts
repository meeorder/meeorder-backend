import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { Types } from 'mongoose';

export class UpdateSessionCouponDto {
  @ApiProperty({ type: String, description: 'Coupon ID', nullable: true })
  @Transform(({ value }) => (value ? new Types.ObjectId(value) : null))
  coupon_id: Types.ObjectId;
}
