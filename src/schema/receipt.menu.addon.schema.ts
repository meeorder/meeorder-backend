import { AddonSchema } from '@/schema/addons.schema';
import { ApiProperty } from '@nestjs/swagger';
import { Ref, isDocument, prop } from '@typegoose/typegoose';
import { Types } from 'mongoose';

export class ReceiptAddonMenuSchema
  implements Pick<AddonSchema, '_id' | 'title' | 'price'>
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

  static fromRef(addon: Ref<AddonSchema>) {
    if (!isDocument(addon)) {
      throw new Error('Addon is not a document');
    }

    const receiptAddon = new ReceiptAddonMenuSchema();
    receiptAddon._id = addon._id;
    receiptAddon.title = addon.title;
    receiptAddon.price = addon.price;

    return receiptAddon;
  }
}
