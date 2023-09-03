import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNumber, IsOptional, IsString } from 'class-validator';
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

  @ApiProperty({
    type: String,
    isArray: true,
    required: false,
  })
  @IsOptional()
  @Transform(({ value }) => value.map((v) => new Types.ObjectId(v)))
  required_menus?: Types.ObjectId[];

  @ApiProperty({
    type: Number,
    description: 'Discount Price of Coupon',
    required: true,
  })
  @IsNumber()
  price: number;

  @ApiProperty({
    type: Number,
    description: 'Amount of Coupon',
    required: false,
  })
  @IsNumber()
  @IsOptional()
  amount: number;

  @ApiProperty({
    type: Number,
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
