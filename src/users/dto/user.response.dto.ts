import { UserRole } from '@/schema/users.schema';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsMongoId, IsString } from 'class-validator';
import { Types } from 'mongoose';

export class CreateUserResponseDto {
  @ApiProperty({ type: String, description: 'User ID' })
  @IsMongoId()
  _id: Types.ObjectId;

  @ApiProperty({ type: String, description: 'Username' })
  @IsString()
  username: string;

  @ApiProperty({ type: String, description: 'Role of user' })
  @IsString()
  @IsEnum(UserRole)
  role: UserRole;
}
