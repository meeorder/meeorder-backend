import { MongoTransform } from '@/utils/mongo-transform';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNumber, IsOptional, IsString, IsUrl } from 'class-validator';
import { Types } from 'mongoose';
export class CreateCouponDto {
  @ApiProperty({ type: String, description: 'Coupon Code', required: true })
  @IsString()
  title: string;

  @ApiProperty({
    type: String,
    description: 'Coupon Description',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ type: String, description: 'Coupon image', required: false })
  @IsUrl()
  @IsOptional()
  image?: string;

  @ApiProperty({
    type: String,
    isArray: true,
    required: false,
  })
  @IsOptional()
  @Transform(new MongoTransform(true).array())
  required_menus?: Types.ObjectId[];

  @ApiProperty({
    type: Number,
    description: 'Discount price of Coupon',
    required: true,
  })
  @IsNumber()
  discount: number;

  @ApiProperty({
    type: Number,
    description: 'Quota of the coupon',
    required: true,
  })
  @IsNumber()
  quota: number;

  @ApiProperty({
    type: Number,
    description: 'Number of coupons that have been redeemed',
    required: false,
  })
  @IsOptional()
  redeemed?: number;

  @ApiProperty({
    type: Boolean,
    description: 'Coupon status',
    required: true,
  })
  activated?: boolean;

  @ApiProperty({
    type: Number,
    description: 'Coupon Required Point',
    required: false,
  })
  @IsNumber()
  @IsOptional()
  required_point?: number;
}
