import { ApiProperty } from '@nestjs/swagger';
import { modelOptions, Prop } from '@typegoose/typegoose';
import { Types } from 'mongoose';

@modelOptions({
  schemaOptions: { collection: 'menus' },
})
export class MenuSchema {
  _id: Types.ObjectId;

  @Prop()
  @ApiProperty()
  image: string;

  @Prop()
  @ApiProperty()
  name: string;

  @Prop()
  @ApiProperty()
  description: string;

  @Prop()
  @ApiProperty()
  price: number;

  @Prop()
  @ApiProperty()
  category: Types.ObjectId;

  @Prop()
  @ApiProperty()
  addons: Types.ObjectId[];

  @Prop({ default: null })
  @ApiProperty()
  created_at: Date;

  @Prop({ default: null })
  @ApiProperty()
  deleted_at: Date;
}
