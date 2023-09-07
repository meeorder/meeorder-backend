import { CouponSchema } from '@/schema/coupons.schema';
import { ApiProperty } from '@nestjs/swagger';

export class ExampleCouponDto extends CouponSchema {
  @ApiProperty({
    type: Boolean,
    description: 'The coupon is redeemable or not',
    required: true,
  })
  redeemable: boolean;
}
