import { ApiProperty } from '@nestjs/swagger';
import { modelOptions, prop } from '@typegoose/typegoose';
import { Exclude } from 'class-transformer';
import { Types } from 'mongoose';

export enum UserRole {
  Owner = 100,
  Cashier = 50,
  Employee = 25,
  Customer = 1,
}

@modelOptions({
  schemaOptions: {
    collection: 'users',
  },
})
export class UserSchema {
  @prop({ auto: true })
  @ApiProperty({ type: String })
  _id: Types.ObjectId;

  @prop({ required: true })
  @ApiProperty()
  username: string;

  @prop({ required: true })
  @Exclude()
  password: string;

  @prop({ default: 0 })
  @ApiProperty()
  point: number;

  @prop({ required: true, enum: UserRole })
  @ApiProperty({ enum: UserRole })
  role: UserRole;
}
