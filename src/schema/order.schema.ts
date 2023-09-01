import { OrderStatus } from '@/orders/enums/orders.status';
import { AddonSchema } from '@/schema/addons.schema';
import { MenuSchema } from '@/schema/menus.schema';
import { SessionSchema } from '@/schema/session.schema';
import { ApiProperty } from '@nestjs/swagger';
import { modelOptions, Prop, Ref } from '@typegoose/typegoose';

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

  @Prop({ ref: () => MenuSchema })
  @ApiProperty({ type: String, description: 'Menu ID' })
  menu: Ref<MenuSchema>;

  @Prop({ ref: () => AddonSchema, default: [] })
  @ApiProperty({ type: [String], description: 'Array of MenuID' })
  addons: Ref<AddonSchema>[];

  @Prop({ default: '' })
  @ApiProperty({ type: String, description: 'Additional info' })
  additional_info: string;

  @Prop({ default: null })
  @ApiProperty({ type: Date, description: 'for cancel status' })
  cancelled_at: Date;
}
