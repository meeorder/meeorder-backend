import { ApiProperty } from '@nestjs/swagger';

export class GetReceiptAmountDto {
  @ApiProperty({
    description: 'Total receipt',
    type: Number,
  })
  all_receipt: number;

  @ApiProperty({
    description: 'Total receipt with registered users',
    type: Number,
  })
  receipt_user: number;

  @ApiProperty({
    description: 'Total receipt without registered users',
    type: Number,
  })
  receipt_no_user: number;
}
