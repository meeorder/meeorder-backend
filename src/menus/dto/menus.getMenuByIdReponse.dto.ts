import { AddonSchema } from '@/schema/addons.schema';
import { CategorySchema } from '@/schema/categories.schema';
import { ApiProperty } from '@nestjs/swagger';
import { Ref } from '@typegoose/typegoose';
import { Types } from 'mongoose';
export class GetMenuByIdResponseDto {
  @ApiProperty({ type: String, description: 'Menu ID' })
  _id: Types.ObjectId;

  @ApiProperty({ type: String, nullable: true, description: 'Menu Image' })
  image: string;

  @ApiProperty({ required: true, type: String, description: 'Menu Title' })
  title: string;

  @ApiProperty({
    type: String,
    nullable: true,
    description: 'Menu Description',
  })
  description: string;

  @ApiProperty({ required: true, type: Number, description: 'Menu Price' })
  price: number;

  @ApiProperty({ type: () => CategorySchema, description: 'Menu Category' })
  category: Ref<CategorySchema>;

  @ApiProperty({
    type: () => AddonSchema,
    isArray: true,
    description: 'Menu Addons',
  })
  addons: Ref<AddonSchema>[];

  @ApiProperty({ type: Date, description: 'Menu Published Date' })
  published_at: Date;

  @ApiProperty({ type: Date, nullable: true, description: 'Menu Deleted Date' })
  deleted_at: Date;
}
