import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { Types } from 'mongoose';
export class CreateMenuDto {
  @ApiProperty({ type: String, nullable: true, description: 'Menu Image' })
  image: string;

  @ApiProperty({ type: String, required: true, description: 'Menu Title' })
  title: string;

  @ApiProperty({
    type: String,
    nullable: true,
    description: 'Menu Description',
  })
  description: string;

  @ApiProperty({ type: Number, required: true, description: 'Menu Price' })
  price: number;

  @ApiProperty({ type: String, required: false, description: 'Menu Category' })
  category?: Types.ObjectId;

  @ApiProperty({ type: String, isArray: true, description: 'Menu Addons' })
  @Transform(({ value }) => value.map((v) => new Types.ObjectId(v)))
  addons: Types.ObjectId[];
}
