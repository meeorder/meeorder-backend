import { AddonSchema } from '@/schema/addons.schema';
import { CategorySchema } from '@/schema/categories.schema';
import { ApiProperty } from '@nestjs/swagger';
import { modelOptions, Prop, Ref } from '@typegoose/typegoose';
import { Date, Types } from 'mongoose';
@modelOptions({
  schemaOptions: { collection: 'menus' },
})
export class MenuSchema {
  @Prop({ auto: true })
  @ApiProperty({ type: String, description: 'Menu ID' })
  _id: Types.ObjectId;

  @Prop({ required: true, type: String })
  @ApiProperty({
    type: String,
    description: 'Menu Image',
  })
  image: string;

  @Prop({ required: true, type: String })
  @ApiProperty({ type: String, description: 'Menu Title' })
  title: string;

  @Prop({ type: String, default: null })
  @ApiProperty({
    type: String,
    description: 'Menu Description',
    nullable: true,
  })
  description: string;

  @Prop({ required: true, type: Number })
  @ApiProperty({ type: Number, description: 'Menu Price' })
  price: number;

  @Prop({ default: null, ref: () => CategorySchema })
  @ApiProperty({
    type: CategorySchema,
    nullable: true,
  })
  category: Ref<CategorySchema, Types.ObjectId>;

  @Prop({ default: [], ref: () => AddonSchema })
  @ApiProperty({
    type: Types.ObjectId,
    isArray: true,
    description: 'Menu Addons',
  })
  addons: Ref<AddonSchema, Types.ObjectId>[];

  @Prop({ default: null, type: Date })
  @ApiProperty({
    type: Date,
    description: 'Menu published date',
    nullable: true,
  })
  published_at: Date;

  @Prop({ default: null, type: Date })
  @ApiProperty({
    type: Date,
    description: 'Menu deleted date',
    nullable: true,
  })
  deleted_at: Date;
}
