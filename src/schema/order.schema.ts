import { OrderStatus } from '@/orders/enums/orders.status';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

@Schema({
  collection: 'orders',
})
export class OrdersClass {
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

export const OrderSchema = SchemaFactory.createForClass(OrdersClass);
