import { ApiProperty } from '@nestjs/swagger';
import { Validate } from 'class-validator';
import { OrderStatus } from '../enums/orders.status';
import { IsObjectId } from '@/validator/mongoose.objectid.validator';

export class UpdateOrderDto {
  @ApiProperty({ enum: OrderStatus, default: OrderStatus.in_queue })
  @Validate(IsObjectId)
  status: OrderStatus;
}
