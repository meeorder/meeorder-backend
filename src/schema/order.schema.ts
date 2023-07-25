import { OrderStatus } from '@/orders/enums/orders.status';
import { modelOptions, Prop } from '@typegoose/typegoose';
import { Types } from 'mongoose';

@modelOptions({
  schemaOptions: { collection: 'orders' },
})
export class OrdersSchema {
  @Prop({ name: 'created_at', default: new Date() })
  created_at: Date;
  @Prop({ default: OrderStatus.InQueue })
  status: OrderStatus;
  @Prop()
  session: Types.ObjectId;
  @Prop()
  menu: Types.ObjectId;
  @Prop()
  addons: Types.ObjectId[];
  @Prop()
  additional_info: string;
}
