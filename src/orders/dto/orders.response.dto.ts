import { OrderStatus } from '@/orders/enums/orders.status';
import { AddonSchema } from '@/schema/addons.schema';
import { MenuSchema } from '@/schema/menus.schema';
import { SessionSchema } from '@/schema/session.schema';
import { ApiProperty } from '@nestjs/swagger';
import { Ref } from '@typegoose/typegoose';
import { Types } from 'mongoose';

export class OrdersResponseDto {
  @ApiProperty({ type: String, description: 'Order ID (ObjectID)' })
  _id: Types.ObjectId;

  @ApiProperty({ type: Date })
  created_at: Date;

  @ApiProperty({ type: String, enum: OrderStatus })
  status: OrderStatus;

  @ApiProperty({ type: () => SessionSchema, description: 'Session Schema' })
  session: Ref<SessionSchema>;

  @ApiProperty({ type: () => MenuSchema, description: 'Menu Schema' })
  menu: Ref<MenuSchema>;

  @ApiProperty({
    type: () => AddonSchema,
    description: 'Array of Addons Schema',
    isArray: true,
  })
  addons: Ref<AddonSchema>[];

  @ApiProperty({ type: String, description: 'Additional info' })
  additional_info: string;

  @ApiProperty({ type: Date, description: 'for cancel status' })
  cancelled_at: Date;
}
