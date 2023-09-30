import { UserSchema } from '@/schema/users.schema';
import { Ref, index, modelOptions, prop } from '@typegoose/typegoose';
import { Types } from 'mongoose';

export enum StatusLogType {
  Ingredient = 'ingredient',
  Addon = 'addon',
}

@modelOptions({
  schemaOptions: {
    timestamps: {
      createdAt: 'modified_at',
    },
  },
})
@index({
  type: 1,
})
export class StatusLogSchema {
  @prop({ auto: true })
  _id: Types.ObjectId;

  @prop({ required: true, enum: StatusLogType })
  type: StatusLogType;

  @prop({ default: [] })
  modified_ids: Types.ObjectId[];

  @prop({ ref: () => UserSchema, required: true })
  modified_by: Ref<UserSchema>;

  modified_at: Date;

  @prop({ required: true })
  modified_value: boolean;
}
