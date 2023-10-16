import { MenuSchema } from '@/schema/menus.schema';
import { ReceiptMenuAddonSchema } from '@/schema/receipt.menu.addon.schema';
import { ApiProperty } from '@nestjs/swagger';
import { prop } from '@typegoose/typegoose';
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

  @prop({ type: () => [ReceiptMenuAddonSchema], required: true })
  @ApiProperty({ type: () => ReceiptMenuAddonSchema, isArray: true })
  addons: ReceiptMenuAddonSchema[];

  constructor(base?: Partial<ReceiptMenuSchema>) {
    Object.assign(this, base);
  }
}
