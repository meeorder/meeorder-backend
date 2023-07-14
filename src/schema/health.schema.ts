import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Types } from 'mongoose';

@Schema({
  collection: 'healths',
})
export class HealthClass {
  _id: Types.ObjectId;

  @ApiProperty()
  id?: string;

  @Prop({ name: 'created_at', default: new Date() })
  @ApiProperty()
  createdAt: Date;
}

export const HealthSchema = SchemaFactory.createForClass(HealthClass);
