import { MenusResponseDto } from '@/menus/dto/menus.response.dto';
import { OrderStatus } from '@/orders/enums/orders.status';
import { AddonSchema } from '@/schema/addons.schema';
import { OrderCancelSchema } from '@/schema/order.cancel.schema';
import { ApiProperty } from '@nestjs/swagger';
import { Types } from 'mongoose';

export class OrdersResponseDto {
  @ApiProperty({ type: String, description: 'Order ID (ObjectID)' })
  _id: Types.ObjectId;

  @ApiProperty({ type: Date })
  created_at: Date;

  @ApiProperty({ type: String, enum: OrderStatus })
  status: OrderStatus;

  @ApiProperty({ type: String, description: 'Session ID' })
  session: Types.ObjectId;

  @ApiProperty({ type: () => MenusResponseDto, description: 'Menu Schema' })
  menu: MenusResponseDto;

  @ApiProperty({
    type: () => AddonSchema,
    description: 'Array of Addons Schema',
    isArray: true,
  })
  addons: AddonSchema[];

  @ApiProperty({ type: String, nullable: true, description: 'Additional info' })
  additional_info: string;

  @ApiProperty({ type: () => OrderCancelSchema, nullable: true })
  cancel: OrderCancelSchema;
}
