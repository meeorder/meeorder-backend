import { ApiProperty } from '@nestjs/swagger';
import { modelOptions, Prop } from '@typegoose/typegoose';
import { Types } from 'mongoose';

@modelOptions({
  schemaOptions: { collection: 'menus' },
})
export class MenuSchema {
  @Prop({ auto: true })
  @ApiProperty({ type: String, description: 'Menu ID' })
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
  @ApiProperty({
    type: String,
  })
  category: Types.ObjectId;

  @Prop()
  @ApiProperty()
  addons: Types.ObjectId[];

  @Prop({ default: null })
  @ApiProperty()
  published_at: Date;

  @Prop({ default: null })
  @ApiProperty()
  deleted_at: Date;
}
