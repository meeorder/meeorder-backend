import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsDate, IsOptional } from 'class-validator';
import { Types } from 'mongoose';
export class CreateMenuDto {
  @ApiProperty()
  image: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  price: number;

  @ApiProperty()
  @Transform(({ value }) => new Types.ObjectId(value))
  category: Types.ObjectId;

  @ApiProperty()
  @Transform(({ value }) => value.map((v) => new Types.ObjectId(v)))
  addons: Types.ObjectId[];

  @ApiProperty()
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  published_at: Date = null;

  @ApiProperty()
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  deleted_at: Date = null;
}
