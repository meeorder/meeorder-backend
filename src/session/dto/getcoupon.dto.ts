import { CouponSchema } from '@/schema/coupons.schema';
import { ApiProperty } from '@nestjs/swagger';

export class CouponDto extends CouponSchema {
  @ApiProperty({ type: Boolean, description: 'isUseable', required: true })
  is_useable: boolean;

  constructor(coupon: CouponSchema, isUseable: boolean) {
    super();
    Object.assign(this, coupon);
    this.is_useable = isUseable;
  }
}
