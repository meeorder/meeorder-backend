import { ApiProperty } from '@nestjs/swagger';

export class ChartDataYearlyDto {
  @ApiProperty({
    description: 'Year (Unix timestamp)',
    type: Number,
  })
  year: number;

  @ApiProperty({
    description: 'Yearly net income',
    type: Number,
  })
  netIncome: number;

  constructor(year: number, netIncome: number) {
    this.year = year;
    this.netIncome = netIncome;
  }
}
