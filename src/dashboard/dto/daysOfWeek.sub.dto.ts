import { ApiProperty } from '@nestjs/swagger';

export class DaysOfWeekSubDto {
  @ApiProperty({
    default: 0,
    description: 'Sunday',
    type: Number,
  })
  Sun: number = 0;

  @ApiProperty({
    default: 0,
    description: 'Monday',
    type: Number,
  })
  Mon: number = 0;

  @ApiProperty({
    default: 0,
    description: 'Tuesday',
    type: Number,
  })
  Tue: number = 0;

  @ApiProperty({
    default: 0,
    description: 'Wednesday',
    type: Number,
  })
  Wed: number = 0;

  @ApiProperty({
    default: 0,
    description: 'Thursday',
    type: Number,
  })
  Thu: number = 0;

  @ApiProperty({
    default: 0,
    description: 'Friday',
    type: Number,
  })
  Fri: number = 0;

  @ApiProperty({
    default: 0,
    description: 'Saturday',
    type: Number,
  })
  Sat: number = 0;
}
