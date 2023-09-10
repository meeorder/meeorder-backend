import { ApiProperty } from '@nestjs/swagger';
import {
  IsAlphanumeric,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

const maxUsernameLength = 32;
const minUsernameLength = 4;

export class RegisterDto {
  @ApiProperty({ type: String, description: 'Username' })
  @IsString()
  @MaxLength(maxUsernameLength)
  @MinLength(minUsernameLength)
  @IsAlphanumeric()
  username: string;

  @ApiProperty({ type: String, description: 'Password' })
  @IsString()
  password: string;
}
