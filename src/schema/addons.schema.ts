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
  @ApiProperty({ type: String, description: 'Addon Title' })
  title: string;

  @Prop({ required: true })
  @ApiProperty({ type: Number, description: 'Addon Price' })
  price: number;

  @Prop({ default: null })
  @ApiProperty({ type: Date, nullable: true, description: 'Addon Image' })
  deleted_at: Date;
}
