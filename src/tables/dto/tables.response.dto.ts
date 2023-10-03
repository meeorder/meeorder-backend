import { ApiProperty } from '@nestjs/swagger';
import { Types } from 'mongoose';

export class TableResponseDto {
  @ApiProperty({ type: String, description: 'Table ID (ObjectID)' })
  _id: Types.ObjectId;

  @ApiProperty({ type: String, description: 'Table number' })
  title: string;

  @ApiProperty({ type: Number, description: 'All orders count' })
  allOrdersCount: number;

  @ApiProperty({ type: Number, description: 'unfinish orders count' })
  unfinishOrdersCount: number;

  @ApiProperty({ type: Number, description: 'total price' })
  totalPrice: number;

  @ApiProperty({ type: Date, description: 'Table creation date' })
  created_at: Date;
}
