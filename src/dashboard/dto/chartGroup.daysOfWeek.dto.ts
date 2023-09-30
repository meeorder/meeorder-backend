import { ApiProperty } from '@nestjs/swagger';

export class ChartGroupDaysOfWeekDto {
  @ApiProperty({
    description: 'Report net income grouped by day of week',
    type: Object,
  })
  daysOfWeek: {
    Mon: number;
    Tue: number;
    Wed: number;
    Thu: number;
    Fri: number;
    Sat: number;
    Sun: number;
  };
}
