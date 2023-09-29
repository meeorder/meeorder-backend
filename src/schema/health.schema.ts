import { ApiProperty } from '@nestjs/swagger';
import { modelOptions } from '@typegoose/typegoose';
import { Types } from 'mongoose';

@modelOptions({
  schemaOptions: {
    collection: 'healths',
    timestamps: {
      createdAt: 'created_at',
      updatedAt: false,
    },
  },
})
export class HealthSchema {
  _id: Types.ObjectId;

  @ApiProperty()
  id?: string;

  @ApiProperty()
  created_at: Date;
}
