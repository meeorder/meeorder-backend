import { UserRole } from '@/schema/users.schema';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsMongoId, IsString } from 'class-validator';
import { Types } from 'mongoose';

export class RegisterResponseDto {
  @ApiProperty({ type: String, description: '_id is ObjectID' })
  @IsMongoId()
  _id: Types.ObjectId;

  @ApiProperty({ type: String, description: 'username is string' })
  @IsString()
  username: string;

  @ApiProperty({ type: String, description: 'role is string' })
  @IsString()
  @IsEnum(UserRole)
  role: UserRole;
}
