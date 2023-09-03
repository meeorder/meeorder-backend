import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNumber, IsOptional, IsString } from 'class-validator';
import { Types } from 'mongoose';
export class CreateMenuDto {
  @ApiProperty({ type: String, description: 'Menu Image', required: true })
  image: string;

  @ApiProperty({ type: String, description: 'Menu Title', required: true })
  @IsString()
  title: string;

  @ApiProperty({
    type: String,
    description: 'Menu Description',
    required: false,
  })
  @IsString()
  @IsOptional()
  description: string;

  @ApiProperty({
    type: Number,
    description: 'Menu Price',
    required: true,
  })
  @IsNumber()
  price: number;

  @ApiProperty({
    type: String,
    description: 'Category id',
    required: false,
  })
  @Transform(({ value }) => new Types.ObjectId(value))
  @IsOptional()
  category: Types.ObjectId;

  @ApiProperty({
    type: String,
    isArray: true,
    required: false,
  })
  @Transform(({ value }) => value.map((v) => new Types.ObjectId(v)))
  @IsOptional()
  addons: Types.ObjectId[];
}
