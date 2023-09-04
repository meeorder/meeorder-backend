import { CouponSchema } from '@/schema/coupons.schema';
import { ApiProperty } from '@nestjs/swagger';

export class CouponDto extends CouponSchema {
  @ApiProperty({ type: Boolean, description: 'isUseable', required: true })
  isuseable: boolean;

  constructor(coupon: CouponSchema, isUseable: boolean) {
    super();
    Object.assign(this, coupon);
    this.isuseable = isUseable;
  }
}
