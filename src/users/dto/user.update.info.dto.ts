import {
  maxUsernameLength,
  minUsernameLength,
} from '@/users/dto/user.create.dto';
import { MaxUsernameLength } from '@/utils/max-username-check';
import { MinUsernameLength } from '@/utils/min-username-check';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsAlphanumeric,
  IsOptional,
  IsString,
  Validate,
} from 'class-validator';

export class UpdateInfoDto {
  @ApiPropertyOptional({ type: String, description: 'New Username' })
  @IsString()
  @IsOptional()
  @Validate(MinUsernameLength, {
    message: `ชื่อผู้ใช้ต้องมีความยาวมากกว่าหรือเท่ากับ ${minUsernameLength} ตัวอักษร`,
  })
  @Validate(MaxUsernameLength, {
    message: `ชื่อผู้ใช้ต้องมีความยาวน้อยกว่าหรือเท่ากับ ${maxUsernameLength} ตัวอักษร`,
  })
  @IsAlphanumeric()
  newUsername?: string;

  @ApiProperty({ type: String, description: 'Old Password' })
  @IsString()
  oldPassword: string;

  @ApiPropertyOptional({ type: String, description: 'New Password' })
  @IsOptional()
  @IsString()
  newPassword?: string;
}
