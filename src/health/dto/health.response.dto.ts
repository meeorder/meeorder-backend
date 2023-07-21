import { ApiProperty } from '@nestjs/swagger';
import { HealthClass } from '@/schema/health.schema';

export class HealthResponseDto extends HealthClass {
  @ApiProperty({
    description: 'Health status',
    example: 'OK',
  })
  status: string;

  constructor(obj: HealthClass, status = 'OK') {
    super();
    Object.assign(this, obj);
    this.status = status;
  }
}
