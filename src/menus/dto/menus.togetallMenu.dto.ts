import { AddonSchema } from '@/schema/addons.schema';
import { IngredientSchema } from '@/schema/ingredients.schema';
import { ApiProperty } from '@nestjs/swagger';
import { Types } from 'mongoose';
export class MenuDtoForAllMenu {
  @ApiProperty({ type: String, description: 'Menu ID' })
  _id: Types.ObjectId;

  @ApiProperty({ type: String, nullable: true, description: 'Menu Image' })
  image: string;

  @ApiProperty({ type: String, description: 'Menu Title' })
  title: string;

  @ApiProperty({
    type: String,
    nullable: true,
    description: 'Menu Description',
  })
  description: string;

  @ApiProperty({ type: Number, description: 'Menu Price' })
  price: number;

  @ApiProperty({
    type: String,
    isArray: true,
    description: 'Menu Ingredients ID',
  })
  ingredients: IngredientSchema[];

  @ApiProperty({
    type: AddonSchema,
    isArray: true,
    description: 'Menu Addons',
  })
  addons: AddonSchema[];

  @ApiProperty({ type: Date, description: 'Menu Published Date' })
  published_at: Date;

  @ApiProperty({ type: Date, nullable: true, description: 'Menu Deleted Date' })
  deleted_at: Date;

  @ApiProperty()
  can_order: boolean;
}
