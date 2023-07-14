import { ApiProperty } from '@nestjs/swagger';

export class HealthResponseDto {
  @ApiProperty({
    description: 'Health status',
    example: 'OK',
  })
  status: string;

  constructor(status: string) {
    this.status = status;
  }
}
