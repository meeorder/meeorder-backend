import { AddonSchema } from '@/schema/addons.schema';
import { CategorySchema } from '@/schema/categories.schema';
import { IngredientSchema } from '@/schema/ingredients.schema';
import { ApiProperty } from '@nestjs/swagger';
import { modelOptions, Prop, Ref } from '@typegoose/typegoose';
import { Types } from 'mongoose';

@modelOptions({
  schemaOptions: { collection: 'menus' },
})
export class MenuSchema {
  @Prop({ auto: true })
  @ApiProperty({ type: String, description: 'Menu ID' })
  _id: Types.ObjectId;

  @Prop({ default: null })
  @ApiProperty({ type: String, nullable: true, description: 'Menu image' })
  image: string;

  @Prop({ required: true })
  @ApiProperty({ type: String, description: 'Menu title' })
  title: string;

  @Prop({ default: null })
  @ApiProperty({
    type: String,
    nullable: true,
    description: 'Menu description',
  })
  description: string;

  @Prop({ required: true })
  @ApiProperty({ type: Number, description: 'Menu price' })
  price: number;

  @Prop({ default: null, ref: () => CategorySchema })
  @ApiProperty({
    type: String,
    nullable: true,
    description: 'Menu category',
  })
  category: Ref<CategorySchema>;

  @Prop({ required: true, ref: () => AddonSchema, default: [] })
  @ApiProperty({ description: 'Menu addons' })
  addons: Ref<AddonSchema>[];

  @Prop({ required: true, ref: () => IngredientSchema, default: [] })
  @ApiProperty({ description: 'Menu ingredients' })
  ingredient: Ref<IngredientSchema>[];

  @Prop({ required: true, default: new Date() })
  @ApiProperty({ type: Date, description: 'Menu publication date' })
  published_at: Date;

  @Prop({ default: null })
  @ApiProperty({
    type: Date,
    nullable: true,
    description: 'Menu deletion date',
  })
  deleted_at: Date;
}
