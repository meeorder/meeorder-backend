import { MaxUsernameLength } from '@/utils/max-username-check';
import { MinUsernameLength } from '@/utils/min-username-check';
import { ApiProperty } from '@nestjs/swagger';
import { IsAlphanumeric, IsString, Validate } from 'class-validator';

const maxUsernameLength = 32;
const minUsernameLength = 4;

export class RegisterDto {
  @ApiProperty({ type: String, description: 'Username' })
  @IsString()
  @Validate(MinUsernameLength, {
    message: `ชื่อผู้ใช้ต้องมีความยาวมากกว่าหรือเท่ากับ ${minUsernameLength} ตัวอักษร`,
  })
  @Validate(MaxUsernameLength, {
    message: `ชื่อผู้ใช้ต้องมีความยาวน้อยกว่าหรือเท่ากับ ${maxUsernameLength} ตัวอักษร`,
  })
  @IsAlphanumeric()
  username: string;

  @ApiProperty({ type: String, description: 'Password' })
  @IsString()
  password: string;
}
