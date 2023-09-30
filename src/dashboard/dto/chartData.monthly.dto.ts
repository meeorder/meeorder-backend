import { ApiProperty } from '@nestjs/swagger';

export class ChartDataMonthlyDto {
  @ApiProperty({
    description: 'Month (Unix timestamp)',
    type: Number,
  })
  month: number;

  @ApiProperty({
    description: 'Monthly net income',
    type: Number,
  })
  netIncome: number;

  constructor(month: number, netIncome: number) {
    this.month = month;
    this.netIncome = netIncome;
  }
}
