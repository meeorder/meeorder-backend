import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

@Schema({
  collection: 'orders',
})
export class OrdersClass {
  @Prop({ name: 'created_at', default: new Date() })
  created_at: Date;
  @Prop({ required: true })
  status: string;
  @Prop()
  uid: string;
  @Prop()
  food: Types.ObjectId;
}

export const OrderSchema = SchemaFactory.createForClass(OrdersClass);
