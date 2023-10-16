import { AddonSchema } from '@/schema/addons.schema';
import { ApiProperty } from '@nestjs/swagger';
import { prop } from '@typegoose/typegoose';
import { Types } from 'mongoose';

export class ReceiptMenuAddonSchema
  implements Pick<AddonSchema, '_id' | 'title' | 'price'>
{
  @prop()
  @ApiProperty({ type: String })
  _id: Types.ObjectId;

  @prop()
  @ApiProperty()
  price: number;

  @prop()
  @ApiProperty()
  title: string;

  constructor(base?: Partial<ReceiptMenuAddonSchema>) {
    Object.assign(this, base);
  }
}
