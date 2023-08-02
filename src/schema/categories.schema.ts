import { ApiProperty } from '@nestjs/swagger';
import { Prop, modelOptions } from '@typegoose/typegoose';
import { Types } from 'mongoose';

@modelOptions({ schemaOptions: { collection: 'categories' } })
export class CategorySchema {
  @Prop({ auto: true })
  @ApiProperty({ type: String, description: 'Category ID' })
  _id: Types.ObjectId;

  @Prop({ required: true })
  @ApiProperty()
  title: string;

  @Prop({ default: [] })
  @ApiProperty({ type: String })
  menus: Types.ObjectId[];

  @Prop({ default: -1 })
  @ApiProperty()
  rank: number;
}
