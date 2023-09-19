import { CouponSchema } from '@/schema/coupons.schema';
import { ApiProperty } from '@nestjs/swagger';
import { prop } from '@typegoose/typegoose';
import { Types } from 'mongoose';

export class ReceiptCouponSchema
  implements Pick<CouponSchema, '_id' | 'title' | 'discount'>
{
  @prop()
  @ApiProperty({ type: String })
  _id: Types.ObjectId;

  @prop()
  @ApiProperty()
  title: string;

  @prop()
  @ApiProperty()
  discount: number;
}
