import { ReceiptCouponSchema } from '@/schema/receipt.coupon.schema';
import { ReceiptMenuSchema } from '@/schema/receipt.menu.schema';
import { ReceiptSchema } from '@/schema/receipt.schema';
import { SessionService } from '@/session/session.service';
import { SettingService } from '@/setting/setting.service';
import { Injectable } from '@nestjs/common';
import { ReturnModelType } from '@typegoose/typegoose';
import { Types } from 'mongoose';
import { InjectModel } from 'nest-typegoose';

@Injectable()
export class ReceiptService {
  constructor(
    @InjectModel(ReceiptSchema)
    private readonly receiptModel: ReturnModelType<typeof ReceiptSchema>,
    private readonly settingService: SettingService,
    private readonly sessionService: SessionService,
  ) {}

  async calculatePoint(totalPrice: number) {
    const ratio = await this.settingService.getRatioPoint();
    return Math.floor(totalPrice / ratio);
  }

  async generateReceipt(sessionId: Types.ObjectId) {
    const receipt = new this.receiptModel();
    const docs = await this.sessionService.listOrdersBySession(sessionId);

    receipt.session = sessionId;
    receipt.menus = docs.orders.;
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
