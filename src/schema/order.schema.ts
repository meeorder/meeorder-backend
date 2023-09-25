import { OrderStatus } from '@/orders/enums/orders.status';
import { AddonSchema } from '@/schema/addons.schema';
import { MenuSchema } from '@/schema/menus.schema';
import { SessionSchema } from '@/schema/session.schema';
import { ApiProperty, getSchemaPath } from '@nestjs/swagger';
import { Prop, Ref, modelOptions } from '@typegoose/typegoose';
import { Types } from 'mongoose';

@modelOptions({
  schemaOptions: {
    collection: 'orders',
    timestamps: {
      createdAt: 'created_at',
      updatedAt: false,
    },
  },
})
export class OrdersSchema {
  @Prop({ auto: true })
  @ApiProperty({ type: String })
  _id: Types.ObjectId;

  @ApiProperty({ type: Date, description: 'Order creation date' })
  created_at: Date;

  @Prop({ default: OrderStatus.InQueue })
  @ApiProperty({ type: String, enum: OrderStatus, description: 'Order status' })
  status: OrderStatus;

  @Prop({ ref: () => SessionSchema })
  @ApiProperty({
    oneOf: [{ $ref: getSchemaPath(SessionSchema) }, { type: 'string' }],
    description: 'Session of the order',
  })
  session: Ref<SessionSchema>;

  @Prop({ ref: () => MenuSchema })
  @ApiProperty({
    oneOf: [{ $ref: getSchemaPath(MenuSchema) }, { type: 'string' }],
    description: 'Menu of the order',
  })
  menu: Ref<MenuSchema>;

  @Prop({ ref: () => AddonSchema, default: [] })
  @ApiProperty({
    type: 'array',
    items: {
      oneOf: [{ type: 'string' }, { $ref: getSchemaPath(AddonSchema) }],
    },
    description: 'Addons of the order',
  })
  addons: Ref<AddonSchema>[];

  @Prop({ default: null })
  @ApiProperty({ type: String, description: 'Additional info' })
  additional_info: string;

  @Prop({ default: null })
  @ApiProperty({ type: Date, description: 'Order cancellation date' })
  cancelled_at: Date;

  @Prop({ default: null })
  @ApiProperty({ type: String, description: 'Reason for cancel order' })
  cancel_reason: string;

  @Prop({ default: null })
  @ApiProperty({
    type: Date,
    nullable: true,
    description: 'Order deletion date',
  })
  deleted_at: Date;
}
