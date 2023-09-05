import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNotEmpty, IsOptional, IsPositive, IsString } from 'class-validator';
import { Types } from 'mongoose';
export class UpdateCategoryDto {
  @ApiProperty({
    type: String,
    description: 'Category title',
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ type: String, isArray: true })
  @Transform(({ value }) => value.map((v) => new Types.ObjectId(v)))
  menus: Types.ObjectId[];

  @ApiProperty({
    type: Number,
    description: 'Category rank',
    default: null,
  })
  @IsPositive()
  @IsOptional()
  rank: number;
}
