import { OrderStatus } from '@/orders/enums/orders.status';
import { SessionSchema } from '@/schema/session.schema';
import { ApiProperty } from '@nestjs/swagger';
import { modelOptions, Prop, Ref } from '@typegoose/typegoose';
import { Schema, Types } from 'mongoose';

@modelOptions({
  schemaOptions: { collection: 'orders' },
})
export class OrdersSchema {
  @Prop({ name: 'created_at', default: new Date() })
  @ApiProperty({ type: Date })
  created_at: Date;

  @Prop({ default: OrderStatus.InQueue })
  @ApiProperty({ type: String, enum: OrderStatus })
  status: OrderStatus;

  @Prop({ ref: () => SessionSchema })
  @ApiProperty({ type: String, description: 'Session ID' })
  session: Ref<SessionSchema>;

  @Prop()
  @ApiProperty({ type: String, description: 'Menu ID' })
  menu: Types.ObjectId;

  @Prop({ type: Schema.Types.ObjectId, default: [] })
  @ApiProperty({ type: [String], description: 'Array of MenuID' })
  addons: Types.ObjectId[];

  @Prop({ default: '' })
  @ApiProperty({ type: String, description: 'Additional info' })
  additional_info: string;

  @Prop({ default: null })
  @ApiProperty({ type: Date, description: 'for cancel status' })
  cancelled_at: Date;
}
