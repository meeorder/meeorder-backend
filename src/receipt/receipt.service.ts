import { OrderStatus } from '@/orders/enums/orders.status';
import { ReceiptCouponSchema } from '@/schema/receipt.coupon.schema';
import { ReceiptMenuSchema } from '@/schema/receipt.menu.schema';
import { ReceiptSchema } from '@/schema/receipt.schema';
import { SessionSchema } from '@/schema/session.schema';
import { SettingService } from '@/setting/setting.service';
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
    private readonly settingService: SettingService,
  ) {}

  async calculatePoint(totalPrice: number) {
    const ratio = await this.settingService.getRatioPoint();
    return ratio === 0 ? 0 : Math.floor(totalPrice / ratio);
  }

  async generateReceipt(session: DocumentType<SessionSchema>) {
    const receipt = new this.receiptModel();
    const { orders, coupon } = await session.populate([
      {
        path: 'orders',
        match: { status: { $ne: OrderStatus.Cancelled } },
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
    receipt.received_point = await this.calculatePoint(receipt.net_price);
    return receipt.save();
  }
}
