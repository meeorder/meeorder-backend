import { UserRole, UserSchema } from '@/schema/users.schema';
import { ApiProperty } from '@nestjs/swagger';
import { DocumentType } from '@typegoose/typegoose';
import { IsEnum, IsMongoId, IsString } from 'class-validator';
import { Types } from 'mongoose';

export class UserResponseDto {
  @ApiProperty({ type: String, description: 'User ID' })
  @IsMongoId()
  _id: Types.ObjectId;

  @ApiProperty({ type: String, description: 'Username' })
  @IsString()
  username: string;

  @ApiProperty({ type: Number, enum: UserRole, description: 'Role of user' })
  @IsEnum(UserRole)
  role: UserRole;

  @ApiProperty({ type: Number })
  point: number;

  static fromDocument(doc: DocumentType<UserSchema>) {
    const dto = new UserResponseDto();
    Object.assign(dto, doc.toObject());
    return dto;
  }
}
