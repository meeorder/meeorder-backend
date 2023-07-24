import { ApiProperty } from '@nestjs/swagger';
import { Prop, modelOptions } from '@typegoose/typegoose';
import { Types } from 'mongoose';

@modelOptions({ schemaOptions: { collection: 'categories' } })
export class CategorySchema {
  _id: Types.ObjectId;

  @Prop({ required: true })
  @ApiProperty()
  title: string;

  @Prop({ required: true })
  @ApiProperty()
  description: string;
}
