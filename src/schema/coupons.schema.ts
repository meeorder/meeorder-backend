import { ApiProperty } from '@nestjs/swagger';
import { Prop, modelOptions } from '@typegoose/typegoose';
import { Types } from 'mongoose';

@modelOptions({
  schemaOptions: { collection: 'coupons' },
})
export class CouponSchema {
  @Prop({ auto: true })
  @ApiProperty({ type: String, description: 'Coupon ID' })
  _id: Types.ObjectId;

  @Prop({ required: true })
  @ApiProperty({ type: String, description: 'Coupon Code' })
  title: string;

  @Prop({ default: null })
  @ApiProperty({ type: String, description: 'Coupon Description' })
  description: string;

  @Prop({ default: null })
  @ApiProperty({
    type: String,
    isArray: true,
    description: 'Coupon Required Menus',
  })
  required_menus: Types.ObjectId[];

  @Prop({ required: true })
  @ApiProperty({
    type: Number,
    description: 'Discount Price of Coupon',
  })
  price: number;

  @Prop({ default: null })
  @ApiProperty({
    type: Number,
    description: 'Amount of Coupon',
  })
  amount: number;

  @Prop({ default: false })
  @ApiProperty({
    type: Boolean,
    description: 'Coupon status',
  })
  activated: boolean;

  @Prop({ default: null })
  @ApiProperty({
    type: Number,
    description: 'Coupon Required Point',
  })
  required_point: number;
}
