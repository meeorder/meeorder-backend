import { SessionSchema } from '@/schema/session.schema';
import { ApiProperty } from '@nestjs/swagger';
import { modelOptions, Prop, Ref } from '@typegoose/typegoose';
import { Types } from 'mongoose';

@modelOptions({
  schemaOptions: {
    collection: 'tables',
    timestamps: {
      createdAt: 'created_at',
      updatedAt: false,
    },
  },
})
export class TablesSchema {
  @Prop({ auto: true })
  @ApiProperty({ type: String, description: 'Table ID' })
  _id: Types.ObjectId;

  @Prop({ required: true })
  @ApiProperty({ type: String, description: 'Table number' })
  title: string;

  @ApiProperty({ type: Date })
  created_at: Date;

  @Prop({ default: null, select: false })
  deleted_at: Date;

  @Prop({
    ref: () => SessionSchema,
    foreignField: 'table',
    localField: '_id',
    justOne: true,
    match: { finished_at: null },
  })
  session: Ref<SessionSchema>;
}
