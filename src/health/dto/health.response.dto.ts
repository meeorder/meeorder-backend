import { ApiProperty } from '@nestjs/swagger';

export class HealthResponseDto {
  @ApiProperty()
  msg = 'pong';
}
