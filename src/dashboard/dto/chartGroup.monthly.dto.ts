import { ApiProperty } from '@nestjs/swagger';

export class ChartGroupMonthlyDto {
  @ApiProperty({
    description: 'Report net income grouped by month',
    type: Object,
  })
  monthly: {
    [month: string]: number;
  };
}
