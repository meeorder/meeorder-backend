import { ApiProperty } from '@nestjs/swagger';

export default class dailyIncomeDto {
  @ApiProperty({
    description: 'Date',
    type: Number,
    required: true,
  })
  date: number;

  @ApiProperty({
    description: 'Daily net income',
    type: Number,
    required: true,
  })
  net_income: number;
}
