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
    @InjectModel(SessionSchema)
    private readonly sessionModel: ReturnModelType<typeof SessionSchema>,
  ) {}

  async generateReceipt(session: DocumentType<SessionSchema>) {
    const receipt = new this.receiptModel();
    const { orders, coupon } = await session.populate([
      {
        path: 'orders',
        select: '',
      },
      {
        path: 'coupon',
        select: '_id title discount',
      },
    ]);
    if (!isDocumentArray(menus)) {
      throw new Error('Menus is not populated');
    }
    receipt.session = session._id;
    receipt.menus = menus.map();
  }
}
