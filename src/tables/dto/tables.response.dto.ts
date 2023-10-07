import { ApiProperty } from '@nestjs/swagger';
import { Types } from 'mongoose';

export class TableResponseDto {
  @ApiProperty({ type: String, description: 'Table ID (ObjectID)' })
  _id: Types.ObjectId;

  @ApiProperty({ type: String, description: 'Table number' })
  title: string;

  @ApiProperty({
    type: String,
    description: 'Session ID (ObjectID)',
    default: null,
  })
  session: Types.ObjectId;

  @ApiProperty({
    type: Date,
    description: 'Session creation date',
    default: null,
  })
  session_create_at: Date;

  @ApiProperty({ type: Number, description: 'All orders count', default: 0 })
  allOrdersCount: number;

  @ApiProperty({
    type: Number,
    description: 'unfinish orders count',
    default: 0,
  })
  unfinishOrdersCount: number;

  @ApiProperty({ type: Number, description: 'total price', default: 0 })
  totalPrice: number;

  @ApiProperty({ type: Date, description: 'Table creation date' })
  created_at: Date;
}
