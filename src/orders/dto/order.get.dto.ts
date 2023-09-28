import { PopulatedCategoryMenuDto } from '@/menus/dto/populated-category.menu.dto';
import { OrderCancelResponseDto } from '@/orders/dto/order.cancel.response.dto';
import { AddonSchema } from '@/schema/addons.schema';
import { MenuSchema } from '@/schema/menus.schema';
import { OrderCancelSchema } from '@/schema/order.cancel.schema';
import { OrdersSchema } from '@/schema/order.schema';
import { SessionSchema } from '@/schema/session.schema';
import { SessionWithTableDto } from '@/session/dto/session[table].dto';
import { ApiProperty } from '@nestjs/swagger';
import { Ref } from '@typegoose/typegoose';

export class OrderGetDto extends OrdersSchema {
  @ApiProperty({
    type: () => AddonSchema,
    isArray: true,
    description: 'Array of MenuID',
  })
  addons: Ref<AddonSchema>[];

  @ApiProperty({
    type: () => SessionWithTableDto,
    description: 'Session (table populated)',
  })
  session: Ref<SessionSchema>;

  @ApiProperty({ type: () => PopulatedCategoryMenuDto })
  menu: Ref<MenuSchema>;

  @ApiProperty({ type: () => OrderCancelResponseDto })
  cancel: OrderCancelSchema;
}
