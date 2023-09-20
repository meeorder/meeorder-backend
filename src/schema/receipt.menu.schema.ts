import { MenuSchema } from '@/schema/menus.schema';
import { ApiProperty } from '@nestjs/swagger';
import { Ref, isDocument, prop } from '@typegoose/typegoose';
import { Types } from 'mongoose';

export class ReceiptMenuSchema
  implements Pick<MenuSchema, '_id' | 'title' | 'price'>
{
  @prop()
  @ApiProperty({ type: String })
  _id: Types.ObjectId;

  @prop()
  @ApiProperty()
  title: string;

  @prop()
  @ApiProperty()
  price: number;

  static fromRef(menu: Ref<MenuSchema>) {
    if (!isDocument(menu)) {
      throw new Error('Menu is not a document');
    }

    const receiptMenu = new ReceiptMenuSchema();
    receiptMenu._id = menu._id;
    receiptMenu.title = menu.title;
    receiptMenu.price = menu.price;

    return receiptMenu;
  }
}
