import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsPositive, IsString } from 'class-validator';
import { Types } from 'mongoose';

export class CreateCategoryDto {
  @ApiProperty({
    type: String,
    description: 'Category title',
    required: true,
  })
  @IsString()
  title: string;

  @ApiProperty({
    type: String,
    description: 'Category description',
    default: [],
  })
  @IsOptional()
  menus: Types.ObjectId[];

  @ApiProperty({
    type: String,
    description: 'Category description',
    default: null,
  })
  @IsPositive()
  @IsOptional()
  rank: number;
}
