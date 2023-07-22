import { OrderStatus } from '@/orders/enums/orders.status';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

@Schema({
  collection: 'orders',
})
export class OrdersClass {
  @Prop({ name: 'created_at', default: new Date() })
  created_at: Date;
  @Prop({ default: OrderStatus.in_queue })
  status: OrderStatus;
  @Prop()
  uid: string;
  @Prop()
  food: Types.ObjectId;
}

export const OrderSchema = SchemaFactory.createForClass(OrdersClass);
