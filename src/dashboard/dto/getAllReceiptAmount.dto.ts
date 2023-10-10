import { ApiProperty } from '@nestjs/swagger';

export class GetReceiptAmountDto {
  @ApiProperty({
    description: 'Total registered users',
    type: Number,
  })
  all_receipt: number;

  @ApiProperty({
    description: 'Total old registered users',
    type: Number,
  })
  receipt_user: number;

  @ApiProperty({
    description: 'Total new registered users',
    type: Number,
  })
  receipt_no_user: number;
}
