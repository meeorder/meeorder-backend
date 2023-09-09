import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength, MinLength } from 'class-validator';

const maxUsernameLength = 32;
const minUsernameLength = 4;

export class RegisterDto {
  @ApiProperty()
  @IsString()
  @MaxLength(maxUsernameLength)
  @MinLength(minUsernameLength)
  username: string;

  @ApiProperty()
  @IsString()
  password: string;
}
