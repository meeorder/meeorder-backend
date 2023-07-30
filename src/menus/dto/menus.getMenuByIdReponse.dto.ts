import { AddonSchema } from '@/schema/addons.schema';
import { ApiProperty } from '@nestjs/swagger';
import { Types } from 'mongoose';
export class GetMenuByIdResponseDto {
  _id: Types.ObjectId;

  @ApiProperty()
  image: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  price: number;

  @ApiProperty()
  category: Types.ObjectId;

  @ApiProperty({ type: AddonSchema, isArray: true })
  addons: AddonSchema[];
}
