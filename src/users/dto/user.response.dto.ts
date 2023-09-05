import { UserRole, UserSchema } from '@/schema/users.schema';
import { ApiProperty } from '@nestjs/swagger';
import { DocumentType } from '@typegoose/typegoose';
import { Types } from 'mongoose';

export class UserResponseDto {
  @ApiProperty({ type: String })
  _id: Types.ObjectId;

  @ApiProperty({ type: String })
  username: string;

  @ApiProperty({ type: Number })
  role: UserRole;

  @ApiProperty({ type: Number })
  point: number;

  static fromDocument(doc: DocumentType<UserSchema>) {
    const dto = new UserResponseDto();
    Object.assign(dto, doc.toObject());
    return dto;
  }
}
