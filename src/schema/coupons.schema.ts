import { MenuSchema } from '@/schema/menus.schema';
import { ApiProperty } from '@nestjs/swagger';
import { Prop, Ref, modelOptions } from '@typegoose/typegoose';
import { Types } from 'mongoose';

@modelOptions({
  schemaOptions: {
    collection: 'coupons',
    timestamps: {
      createdAt: 'created_at',
      updatedAt: false,
    },
  },
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

  @Prop({ default: null })
  @ApiProperty({ type: String, description: 'Coupon image' })
  image: string;

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
    description: 'Discount price of the Coupon',
  })
  discount: number;

  @Prop({ required: true })
  @ApiProperty({
    type: Number,
    description: 'Quota of the coupon',
  })
  quota: number;

  @Prop({ default: 0 })
  @ApiProperty({
    type: Number,
    description: 'Number of coupons that have been redeemed',
  })
  redeemed: number;

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

  @ApiProperty({ type: Date })
  created_at: Date;
}
