import { ApiProperty } from '@nestjs/swagger';
import { Types } from 'mongoose';

export class MenusResponseDto {
  @ApiProperty({ type: String, description: 'Menu ID' })
  _id: Types.ObjectId;

  @ApiProperty({ type: String, nullable: true, description: 'Menu image' })
  image: string;

  @ApiProperty({ type: String, description: 'Menu title' })
  title: string;

  @ApiProperty({
    type: String,
    nullable: true,
    description: 'Menu description',
  })
  description: string;

  @ApiProperty({ type: Number, description: 'Menu price' })
  price: number;

  @ApiProperty({ type: String, description: 'Menu category' })
  category: Types.ObjectId;

  @ApiProperty({ type: String, isArray: true, description: 'Menu addons' })
  addons: Types.ObjectId[];

  @ApiProperty({ type: Date, description: 'Menu publication date' })
  published_at: Date;

  @ApiProperty({
    type: Date,
    nullable: true,
    description: 'Menu deletion date',
  })
  deleted_at: Date;
}
