import { CouponSchema } from '@/schema/coupons.schema';
import { TablesSchema } from '@/schema/tables.schema';
import { UserSchema } from '@/schema/users.schema';
import { ApiProperty } from '@nestjs/swagger';
import { Types } from 'mongoose';

export class GetSessionDto {
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
    type: () => UserSchema,
    description: 'Current head user of session',
    nullable: true,
  })
  user: Types.ObjectId;

  @ApiProperty({
    type: () => CouponSchema,
    nullable: true,
    description: 'Current coupon in session',
  })
  coupon: CouponSchema;

  @ApiProperty({ type: () => TablesSchema, description: "Session's Table" })
  table: TablesSchema;

  @ApiProperty({
    type: Date,
    nullable: true,
    description: 'Session deletion date',
  })
  deleted_at: Date;
}
