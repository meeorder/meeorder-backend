import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
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
}
