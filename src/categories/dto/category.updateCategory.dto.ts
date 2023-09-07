import { MongoTransform } from '@/utils/mongo-transform';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsArray, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Types } from 'mongoose';
export class UpdateCategoryDto {
  @ApiProperty({
    type: String,
    description: 'Category title',
    required: false,
  })
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  title?: string;

  @ApiProperty({ type: String, isArray: true, required: false })
  @Transform(new MongoTransform().array())
  @IsOptional()
  @IsNotEmpty()
  @IsArray()
  menus?: Types.ObjectId[];
}
