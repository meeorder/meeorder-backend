import { ApiProperty } from '@nestjs/swagger';

export class ChartGroupHourlyDto {
  @ApiProperty({
    description: 'Report net income grouped by hour',
    type: Object,
  })
  hourly: {
    [hour: string]: number;
  };
}
