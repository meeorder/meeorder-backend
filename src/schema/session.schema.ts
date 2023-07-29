import { Prop, modelOptions } from '@typegoose/typegoose';
import { Types } from 'mongoose';
import { validate as isUUID } from 'uuid';

@modelOptions({
  schemaOptions: {
    collection: 'sessions',
  },
})
export class SessionSchema {
  @Prop({ auto: true })
  _id: Types.ObjectId;

  @Prop({ default: new Date() })
  created_at: Date;

  @Prop({ default: null })
  finished_at: Date;

  @Prop({ default: null, validate: (v: string) => (v ? isUUID(v) : true) })
  uid: string;

  @Prop({ required: true })
  table: number;
}
