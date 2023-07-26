import { ApiProperty } from '@nestjs/swagger';
import { Prop, modelOptions } from '@typegoose/typegoose';

@modelOptions({
  schemaOptions: { collection: 'tables' },
})
export class TableSchema {
  @Prop({ required: true, type: Number })
  @ApiProperty()
  _id: number;

  id: number;
}
