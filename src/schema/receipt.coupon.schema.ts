import { CouponSchema } from '@/schema/coupons.schema';
import { ApiProperty } from '@nestjs/swagger';
import { Ref, isDocument, prop } from '@typegoose/typegoose';
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

  static fromRef(coupon: Ref<CouponSchema>) {
    if (!isDocument(coupon)) {
      throw new Error('Coupon is not a document');
    }

    const receiptCoupon = new ReceiptCouponSchema();
    receiptCoupon._id = coupon._id;
    receiptCoupon.title = coupon.title;
    receiptCoupon.discount = coupon.discount;

    return receiptCoupon;
  }
}
