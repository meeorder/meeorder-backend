import { CouponSchema } from '@/schema/coupons.schema';
import { ApiProperty } from '@nestjs/swagger';

export class ExampleCouponDto extends CouponSchema {
  @ApiProperty({ type: Boolean, description: 'isUseable', required: true })
  isuseable: boolean;
}
