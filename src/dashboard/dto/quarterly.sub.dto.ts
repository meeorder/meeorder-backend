import { ApiProperty } from '@nestjs/swagger';

export class QuarterlySubDto {
  @ApiProperty({
    default: 0,
    description: 'First Quarter',
    type: Number,
  })
  Q1: number = 0;

  @ApiProperty({
    default: 0,
    description: 'Second Quarter',
    type: Number,
  })
  Q2: number = 0;

  @ApiProperty({
    default: 0,
    description: 'Third Quarter',
    type: Number,
  })
  Q3: number = 0;

  @ApiProperty({
    default: 0,
    description: 'Fourth Quarter',
    type: Number,
  })
  Q4: number = 0;
}
