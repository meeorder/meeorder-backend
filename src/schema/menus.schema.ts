import { AddonSchema } from '@/schema/addons.schema';
import { CategorySchema } from '@/schema/categories.schema';
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
  @ApiProperty({ type: String, nullable: true, description: 'Menu Image' })
  image: string;

  @Prop({ required: true })
  @ApiProperty({ type: String, description: 'Menu Title' })
  title: string;

  @Prop({ default: null })
  @ApiProperty({
    type: String,
    nullable: true,
    description: 'Menu Description',
  })
  description: string;

  @Prop({ required: true })
  @ApiProperty({ type: Number, description: 'Menu Price' })
  price: number;

  @Prop({ required: true, ref: () => CategorySchema })
  @ApiProperty({ description: 'Menu Category' })
  category: Ref<CategorySchema>;

  @Prop({ required: true, ref: () => AddonSchema, default: [] })
  @ApiProperty({ description: 'Menu Addons' })
  addons: Ref<AddonSchema>[];

  @Prop({ required: true, default: new Date() })
  @ApiProperty({ type: Date, description: 'Menu Published Date' })
  published_at: Date;

  @Prop({ default: null })
  @ApiProperty({ type: Date, nullable: true, description: 'Menu Deleted Date' })
  deleted_at: Date;
}
