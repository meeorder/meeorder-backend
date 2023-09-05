import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { Types } from 'mongoose';
export class CreateMenuDto {
  @ApiProperty({ type: String })
  image: string;

  @ApiProperty({ type: String })
  title: string;

  @ApiProperty({ type: String })
  description: string;

  @ApiProperty({ type: Number })
  price: number;

  @ApiProperty({ type: String })
  @Transform(({ value }) => new Types.ObjectId(value))
  category: Types.ObjectId;

  @ApiProperty()
  @Transform(({ value }) => value.map((v) => new Types.ObjectId(v)))
  addons: Types.ObjectId[];
}
