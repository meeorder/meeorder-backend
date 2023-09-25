import { PopulatedCategoryMenuDto } from '@/menus/dto/populated-category.menu.dto';
import { OrderStatus } from '@/orders/enums/orders.status';
import { AddonSchema } from '@/schema/addons.schema';
import { SessionWithTableDto } from '@/session/dto/session[table].dto';
import { ApiProperty } from '@nestjs/swagger';
import { Types } from 'mongoose';

export class OrderGetDto {
  @ApiProperty({ type: String, description: 'Orders ID' })
  '_id': Types.ObjectId;

  @ApiProperty({ type: Date })
  created_at: Date;

  @ApiProperty({ type: String, enum: OrderStatus })
  status: OrderStatus;

  @ApiProperty({
    type: () => AddonSchema,
    isArray: true,
    description: 'Array of MenuID',
  })
  addons: AddonSchema[];

  @ApiProperty({ type: String, description: 'Additional info' })
  additional_info: string;

  @ApiProperty({ type: Date, description: 'for cancel status' })
  cancelled_at: Date;

  @ApiProperty({ type: String, isArray: true })
  cancel_reason: string[];

  @ApiProperty({
    type: () => SessionWithTableDto,
    description: 'Session (table populated)',
  })
  session: SessionWithTableDto;

  @ApiProperty({ type: () => PopulatedCategoryMenuDto })
  menu: PopulatedCategoryMenuDto;
}
