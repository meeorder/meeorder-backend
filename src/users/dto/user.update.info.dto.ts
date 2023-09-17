import {
  maxUsernameLength,
  minUsernameLength,
} from '@/users/dto/user.create.dto';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsAlphanumeric,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class UpdateInfoDto {
  @ApiProperty({ type: String, description: 'New Username' })
  @IsString()
  @IsOptional()
  @MaxLength(maxUsernameLength)
  @MinLength(minUsernameLength)
  @IsAlphanumeric()
  newUsername?: string;

  @ApiProperty({ type: String, description: 'Old Password' })
  @IsString()
  oldPassword: string;
  @ApiProperty({ type: String, description: 'New Password' })
  @IsOptional()
  @IsString()
  newPassword?: string;
}
