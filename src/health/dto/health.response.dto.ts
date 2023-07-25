import { HealthSchema } from '@/schema/health.schema';
import { ApiProperty } from '@nestjs/swagger';

export class HealthResponseDto extends HealthSchema {
  @ApiProperty({
    description: 'Health status',
    example: 'OK',
  })
  status: string;

  constructor(obj: HealthSchema, status = 'OK') {
    super();
    Object.assign(this, obj);
    this.status = status;
  }
}
