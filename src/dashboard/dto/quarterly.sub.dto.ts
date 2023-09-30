import { ApiProperty } from '@nestjs/swagger';

export class QuarterlySubDto {
  @ApiProperty({
    default: 0,
    description: 'First Quarter',
    type: Number,
  })
  Q1: number;

  @ApiProperty({
    default: 0,
    description: 'Second Quarter',
    type: Number,
  })
  Q2: number;

  @ApiProperty({
    default: 0,
    description: 'Third Quarter',
    type: Number,
  })
  Q3: number;

  @ApiProperty({
    default: 0,
    description: 'Fourth Quarter',
    type: Number,
  })
  Q4: number;
}
