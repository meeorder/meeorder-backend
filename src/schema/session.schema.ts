import { TablesSchema } from '@/schema/tables.schema';
import { ApiProperty } from '@nestjs/swagger';
import { Prop, Ref, modelOptions } from '@typegoose/typegoose';
import { Types } from 'mongoose';
import { validate as isUUID } from 'uuid';

@modelOptions({
  schemaOptions: {
    collection: 'sessions',
  },
})
export class SessionSchema {
  @Prop({ auto: true })
  @ApiProperty({ type: String, description: 'Session ID' })
  _id: Types.ObjectId;

  @Prop({ default: new Date() })
  @ApiProperty({ type: Date, description: 'Session creation date' })
  created_at: Date;

  @Prop({ default: null })
  @ApiProperty({
    type: Date,
    description: 'Session finish date',
    nullable: true,
  })
  finished_at: Date;

  @Prop({ default: null, validate: (v: string) => (v ? isUUID(v) : true) })
  @ApiProperty({
    type: String,
    description: 'User ID',
    nullable: true,
  })
  uid: string;

  @Prop({ required: true, ref: () => TablesSchema, type: Number })
  @ApiProperty({ type: Number, description: 'Table ID' })
  table: Ref<TablesSchema, number>;

  @Prop({ default: null })
  deleted_at: Date;
}
