import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Types } from 'mongoose';

@Schema({ collection: 'categories' })
export class CategoryClass {
  _id: Types.ObjectId;

  @Prop({ required: true })
  @ApiProperty()
  title: string;

  @Prop({ required: true })
  @ApiProperty()
  description: string;
}

export const CategorySchema = SchemaFactory.createForClass(CategoryClass);
