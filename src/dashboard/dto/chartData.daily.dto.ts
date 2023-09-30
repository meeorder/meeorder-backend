import { ApiProperty } from '@nestjs/swagger';

export class ChartDataDailyDto {
  @ApiProperty({
    description: 'Date',
    type: Number,
  })
  date: number;

  @ApiProperty({
    description: 'Daily net income',
    type: Number,
  })
  netIncome: number;

  constructor(date: number, netIncome: number) {
    this.date = date;
    this.netIncome = netIncome;
  }
}
