import { ApiProperty } from '@nestjs/swagger';

export class GetNetIncomeDto {
  @ApiProperty({
    description: 'Total income',
    type: Number,
  })
  totalIncome: number;

  @ApiProperty({
    description: 'Total discount',
    type: Number,
  })
  totalDiscount: number;

  @ApiProperty({
    description: 'Total net income (income - discount)',
    type: Number,
  })
  totalNetIncome: number;
}
