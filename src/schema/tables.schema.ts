import { ApiProperty } from '@nestjs/swagger';
import { modelOptions, Prop } from '@typegoose/typegoose';
import { Types } from 'mongoose';

@modelOptions({
  schemaOptions: { collection: 'tables' },
})
export class TablesSchema {
  @Prop({ auto: true })
  @ApiProperty()
  _id: Types.ObjectId;

  @Prop({ required: true })
  @ApiProperty()
  table_number: number;
}
