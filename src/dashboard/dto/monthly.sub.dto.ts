import { ApiProperty } from '@nestjs/swagger';

export class MonthlySubDto {
  @ApiProperty({
    default: 0,
    description: 'January',
    type: Number,
  })
  Jan: number = 0;

  @ApiProperty({
    default: 0,
    description: 'February',
    type: Number,
  })
  Feb: number = 0;

  @ApiProperty({
    default: 0,
    description: 'March',
    type: Number,
  })
  Mar: number = 0;

  @ApiProperty({
    default: 0,
    description: 'April',
    type: Number,
  })
  Apr: number = 0;

  @ApiProperty({
    default: 0,
    description: 'May',
    type: Number,
  })
  May: number = 0;

  @ApiProperty({
    default: 0,
    description: 'June',
    type: Number,
  })
  Jun: number = 0;

  @ApiProperty({
    default: 0,
    description: 'July',
    type: Number,
  })
  Jul: number = 0;

  @ApiProperty({
    default: 0,
    description: 'August',
    type: Number,
  })
  Aug: number = 0;

  @ApiProperty({
    default: 0,
    description: 'September',
    type: Number,
  })
  Sep: number = 0;

  @ApiProperty({
    default: 0,
    description: 'October',
    type: Number,
  })
  Oct: number = 0;

  @ApiProperty({
    default: 0,
    description: 'November',
    type: Number,
  })
  Nov: number = 0;

  @ApiProperty({
    default: 0,
    description: 'December',
    type: Number,
  })
  Dec: number = 0;
}
