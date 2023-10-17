import { ApiProperty } from '@nestjs/swagger';

export class GetIncomePerReceiptDto {
  @ApiProperty({
    description: 'average income per receipt',
    type: Number,
  })
  income_per_receipt: number;

  @ApiProperty({
    description: 'receipt amount today',
    type: Number,
  })
  receipt_amount: number;

  @ApiProperty({
    description: 'net income today',
    type: Number,
  })
  net_income: number;
}
