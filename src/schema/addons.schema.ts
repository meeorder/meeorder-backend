import { ApiProperty } from '@nestjs/swagger';
import { Prop, modelOptions } from '@typegoose/typegoose';
import { Types } from 'mongoose';

@modelOptions({
  schemaOptions: { collection: 'addons' },
})
export class AddonSchema {
  @Prop({ auto: true })
  @ApiProperty({ type: String, description: 'Addon ID' })
  _id: Types.ObjectId;

  @Prop({ required: true })
  @ApiProperty()
  title: string;

  @Prop({ required: true })
  @ApiProperty()
  price: number;

  @Prop({ default: null })
  deleted_at: Date;
}
