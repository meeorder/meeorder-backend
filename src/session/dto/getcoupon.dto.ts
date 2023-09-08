import { CouponSchema } from '@/schema/coupons.schema';
import { ApiProperty } from '@nestjs/swagger';

export class CouponDto extends CouponSchema {
  @ApiProperty({
    type: Boolean,
    description: 'The coupon is redeemable or not',
    required: true,
  })
  redeemable: boolean;

  constructor(coupon: CouponSchema, redeemable: boolean) {
    super();
    Object.assign(this, coupon);
    this.redeemable = redeemable;
  }
}
