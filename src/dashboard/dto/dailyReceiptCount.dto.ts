import { ApiProperty } from '@nestjs/swagger';

export default class DailyReceiptCountDto {
  @ApiProperty({
    description: 'Date',
    type: Number,
    required: true,
  })
  date: number;

  @ApiProperty({
    description: 'Total receipt count',
    type: Number,
    required: true,
  })
  total_receipt_count: number;
}
