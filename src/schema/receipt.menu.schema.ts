import { AddonSchema } from '@/schema/addons.schema';
import { MenuSchema } from '@/schema/menus.schema';
import { ReceiptAddonMenuSchema } from '@/schema/receipt.menu.addon.schema';
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

  @prop({ type: () => [ReceiptAddonMenuSchema] })
  @ApiProperty({ type: () => ReceiptAddonMenuSchema, isArray: true })
  addons: ReceiptAddonMenuSchema[];

  static fromRef(menu: Ref<MenuSchema>, addons: Ref<AddonSchema>[]) {
    if (!isDocument(menu)) {
      throw new Error('Menu is not a document');
    }

    const receiptMenu = new ReceiptMenuSchema();
    receiptMenu._id = menu._id;
    receiptMenu.title = menu.title;
    receiptMenu.price = menu.price;
    receiptMenu.addons = addons.map((addon) =>
      ReceiptAddonMenuSchema.fromRef(addon),
    );

    return receiptMenu;
  }
}
