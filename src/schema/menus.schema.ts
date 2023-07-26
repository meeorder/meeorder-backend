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
  addon: Types.ObjectId[];
}
