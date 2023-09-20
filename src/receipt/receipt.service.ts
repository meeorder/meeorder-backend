import { ReceiptCouponSchema } from '@/schema/receipt.coupon.schema';
import { ReceiptMenuSchema } from '@/schema/receipt.menu.schema';
import { ReceiptSchema } from '@/schema/receipt.schema';
import { SessionSchema } from '@/schema/session.schema';
import { Injectable } from '@nestjs/common';
import {
  DocumentType,
  ReturnModelType,
  isDocumentArray,
} from '@typegoose/typegoose';
import { InjectModel } from 'nest-typegoose';

@Injectable()
export class ReceiptService {
  constructor(
    @InjectModel(ReceiptSchema)
    private readonly receiptModel: ReturnModelType<typeof ReceiptSchema>,
  ) {}

  async generateReceipt(session: DocumentType<SessionSchema>) {
    const receipt = new this.receiptModel();
    const { orders, coupon } = await session.populate([
      {
        path: 'orders',
        select: 'menu',
        populate: {
          path: 'menu',
          select: '_id title price',
        },
      },
      {
        path: 'coupon',
        select: '_id title discount',
      },
    ]);
    if (!isDocumentArray(orders)) {
      throw new Error('orders is not populated');
    }
    receipt.session = session._id;
    receipt.menus = orders.map(({ menu }) => ReceiptMenuSchema.fromRef(menu));
    receipt.coupon = coupon ? ReceiptCouponSchema.fromRef(coupon) : null;
    receipt.total_price = receipt.menus.reduce(
      (prev, { price }) => prev + price,
      0,
    );
    receipt.discount_price = receipt.coupon?.discount ?? 0;
    return receipt.save();
  }
}
