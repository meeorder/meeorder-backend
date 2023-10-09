import { ApiProperty } from '@nestjs/swagger';
import { Prop, modelOptions } from '@typegoose/typegoose';
import { Types } from 'mongoose';

@modelOptions({
  schemaOptions: {
    collection: 'settings',
    timestamps: {
      createdAt: 'created_at',
      updatedAt: false,
    },
  },
})
export class SettingSchema {
  @Prop({ auto: true })
  @ApiProperty({ type: String, description: 'Setting ID' })
  _id: Types.ObjectId;

  @Prop({ default: null })
  @ApiProperty({ type: String, description: 'Restaurant Name' })
  name: string;

  @Prop({ default: null })
  @ApiProperty({ type: String, description: 'Restaurant Logo' })
  logo: string;
}
