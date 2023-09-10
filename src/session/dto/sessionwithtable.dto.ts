import { TablesSchema } from '@/schema/tables.schema';
import { ApiProperty } from '@nestjs/swagger';
import { Types } from 'mongoose';

export class SessionWithTable {
  @ApiProperty({ type: String, description: 'Session ID' })
  _id: Types.ObjectId;

  @ApiProperty({ type: Date, description: 'Session creation date' })
  created_at: Date;

  @ApiProperty({
    type: Date,
    description: 'Session finish date',
    nullable: true,
  })
  finished_at: Date;

  @ApiProperty({
    type: String,
    description: 'Current head user of session',
    nullable: true,
  })
  user: Types.ObjectId;

  @ApiProperty({ description: 'User point' })
  point: number;

  @ApiProperty({
    type: String,
    nullable: true,
    description: 'Current coupon in session',
  })
  coupon: Types.ObjectId;

  @ApiProperty({ type: () => TablesSchema, description: "Session's Table" })
  table: TablesSchema;

  @ApiProperty({
    type: Date,
    nullable: true,
    description: 'Session deletion date',
  })
  deleted_at: Date;
}
