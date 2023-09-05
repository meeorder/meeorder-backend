import { ApiProperty } from '@nestjs/swagger';

export class LoginResponseDto {
  @ApiProperty({ example: 'eyJ ...', description: 'JWT access token' })
  access_token: string;

  constructor(accessToken: string) {
    this.access_token = accessToken;
  }
}
