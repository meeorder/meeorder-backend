import { MenuSchema } from '@/schema/menus.schema';
import { ApiProperty } from '@nestjs/swagger';
export class CouponResponseDTO {
  @ApiProperty({ type: String, description: 'Coupon Code', required: true })
  title: string;

  @ApiProperty({
    type: String,
    description: 'Coupon Description',
  })
  description?: string;

  @ApiProperty({ type: String, description: 'Coupon image' })
  image?: string;

  @ApiProperty({
    type: MenuSchema,
    isArray: true,
  })
  required_menus?: MenuSchema[];

  @ApiProperty({
    type: Number,
    description: 'Discount price of Coupon',
  })
  discount: number;

  @ApiProperty({
    type: Number,
    description: 'Quota of the coupon',
  })
  quota: number;

  @ApiProperty({
    type: Number,
    description: 'Number of coupons that have been redeemed',
  })
  redeemed?: number;

  @ApiProperty({
    type: Boolean,
    description: 'Coupon status',
  })
  activated?: boolean;

  @ApiProperty({
    type: Number,
    description: 'Coupon Required Point',
  })
  required_point?: number;
}
