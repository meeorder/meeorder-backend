import { OrderStatus } from '@/orders/enums/orders.status';
import { AddonSchema } from '@/schema/addons.schema';
import { MenuSchema } from '@/schema/menus.schema';
import { OrderCancelSchema } from '@/schema/order.cancel.schema';
import { ApiProperty } from '@nestjs/swagger';

export class AllPopulatedOrderDto {
  @ApiProperty()
  _id: string;

  @ApiProperty({ type: Date })
  created_at: Date;

  @ApiProperty({ enum: OrderStatus })
  status: OrderStatus;

  @ApiProperty()
  session: string;

  @ApiProperty({ type: () => MenuSchema })
  menu: MenuSchema;

  @ApiProperty({ type: () => AddonSchema, isArray: true })
  addons: AddonSchema[];

  @ApiProperty()
  additional_info: string;

  @ApiProperty()
  deleted_at: Date;

  @ApiProperty({ type: () => OrderCancelSchema })
  cancel: OrderCancelSchema;
}
