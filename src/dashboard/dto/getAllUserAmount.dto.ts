import { ApiProperty } from '@nestjs/swagger';

export class GetUserAmountDto {
  @ApiProperty({
    description: 'Total registered users',
    type: Number,
  })
  total_user: number;

  @ApiProperty({
    description: 'Total old registered users',
    type: Number,
  })
  old_user: number;

  @ApiProperty({
    description: 'Total new registered users',
    type: Number,
  })
  new_user: number;
}
