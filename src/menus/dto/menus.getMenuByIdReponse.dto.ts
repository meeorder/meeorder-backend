import { AddonSchema } from '@/schema/addons.schema';
import { ApiProperty } from '@nestjs/swagger';
import { Types } from 'mongoose';
export class GetMenuByIdResponseDto {
  @ApiProperty()
  _id: Types.ObjectId;

  @ApiProperty()
  image: string;

  @ApiProperty()
  title: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  price: number;

  @ApiProperty({
    type: String,
  })
  category: Types.ObjectId;

  @ApiProperty({ type: AddonSchema, isArray: true })
  addons: AddonSchema[];

  @ApiProperty()
  published_at: Date;

  @ApiProperty()
  deleted_at: Date;
}
