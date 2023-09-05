import { MenuSchema } from '@/schema/menus.schema';
import { ApiProperty } from '@nestjs/swagger';
import { Prop, Ref, modelOptions } from '@typegoose/typegoose';
import { Types } from 'mongoose';

@modelOptions({
  schemaOptions: { collection: 'coupons' },
})
export class CouponSchema {
  @Prop({ auto: true })
  @ApiProperty({ type: String, description: 'Coupon ID' })
  _id: Types.ObjectId;

  @Prop({ required: true })
  @ApiProperty({ type: String, description: 'Coupon title' })
  title: string;

  @Prop({ default: null })
  @ApiProperty({ type: String, description: 'Coupon description' })
  description: string;

  @Prop({ default: [], ref: () => MenuSchema })
  @ApiProperty({
    type: String,
    isArray: true,
    description: 'Coupon required menus',
  })
  required_menus: Ref<MenuSchema>[];

  @Prop({ required: true })
  @ApiProperty({
    type: Number,
    description: 'Discount price of the coupon',
  })
  price: number;

  @Prop({ default: null })
  @ApiProperty({
    type: Number,
    description: 'Amount of coupon',
  })
  amount: number;

  @Prop({ default: false })
  @ApiProperty({
    type: Boolean,
    description: 'Coupon status',
  })
  activated: boolean;

  @Prop({ default: 0 })
  @ApiProperty({
    type: Number,
    description: 'Coupon required point',
  })
  required_point: number;
}
