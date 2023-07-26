import { modelOptions } from '@typegoose/typegoose';
import { Types } from 'mongoose';

@modelOptions({
  schemaOptions: { collection: 'addons' },
})
export class AddonSchema {
  _id: Types.ObjectId;
}
