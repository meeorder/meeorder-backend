import { ApiProperty } from '@nestjs/swagger';

export class GetRecieptAmountDto {
  @ApiProperty({
    description: 'Total registered users',
    type: Number,
  })
  all_reciept: number;

  @ApiProperty({
    description: 'Total old registered users',
    type: Number,
  })
  reciept_user: number;

  @ApiProperty({
    description: 'Total new registered users',
    type: Number,
  })
  reciept_no_user: number;
}
