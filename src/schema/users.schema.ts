import { ApiProperty } from '@nestjs/swagger';
import { modelOptions, prop } from '@typegoose/typegoose';
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
    timestamps: {
      createdAt: 'created_at',
      updatedAt: false,
    },
  },
})
export class UserSchema {
  @prop({ auto: true })
  @ApiProperty({ type: String, description: 'User ID' })
  _id: Types.ObjectId;

  @prop({ unique: true, required: true })
  @ApiProperty({ type: String, description: 'User name' })
  username: string;

  @prop({ required: true, select: false })
  password: string;

  @prop({ default: 0 })
  @ApiProperty({ type: Number, description: 'User point' })
  point: number;

  @prop({ required: true, enum: UserRole })
  @ApiProperty({ enum: UserRole, description: 'User role' })
  role: UserRole;

  @ApiProperty({
    type: Date,
    default: new Date(),
    description: 'User creation date',
  })
  created_at: Date;

  @prop({ default: null })
  @ApiProperty({
    type: Date,
    nullable: true,
    description: 'User deletion date',
  })
  deleted_at: Date;
}
