import { ApiProperty } from '@nestjs/swagger';
import { Prop, modelOptions } from '@typegoose/typegoose';
import { Types } from 'mongoose';

@modelOptions({
  schemaOptions: {
    collection: 'settings',
    timestamps: {
      createdAt: false,
      updatedAt: 'updated_at',
    },
  },
})
export class SettingSchema {
  @Prop({ auto: true })
  @ApiProperty({ type: String, description: 'Setting ID' })
  _id: Types.ObjectId;

  @Prop({ default: null, nullable: true })
  @ApiProperty({ type: String, description: 'Restaurant Name', nullable: true })
  name: string;

  @Prop({ default: null, nullable: true })
  @ApiProperty({ type: String, description: 'Restaurant Logo', nullable: true })
  logo: string;
}
