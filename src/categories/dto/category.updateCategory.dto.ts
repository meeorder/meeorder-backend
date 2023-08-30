import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNumber, IsString } from 'class-validator';
import { Types } from 'mongoose';

export class UpdateCategoryDto {
  @ApiProperty()
  @IsString()
  title: string;

  @ApiProperty()
  @Transform(({ value }) => value.map((v) => new Types.ObjectId(v)))
  menus: Types.ObjectId[];

  @ApiProperty()
  @IsNumber()
  rank: number;
}
