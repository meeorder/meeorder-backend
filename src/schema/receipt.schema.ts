import { SessionSchema } from '@/schema/session.schema';
import { Ref, modelOptions, prop } from '@typegoose/typegoose';
import { Types } from 'mongoose';

@modelOptions({
  schemaOptions: {
    collection: 'receipts',
  },
})
export class ReceiptSchema {
  @prop({ auto: true })
  _id: Types.ObjectId;

  @prop({ ref: () => SessionSchema, required: true })
  session: Ref<SessionSchema>;

  @prop({})
  menus: Types.ObjectId[];
}
