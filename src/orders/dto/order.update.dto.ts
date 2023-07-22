import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { OrderStatus } from '../enums/orders.status';

export class UpdateOrderDto {
  @ApiProperty({ enum: OrderStatus, default: OrderStatus.in_queue })
  @IsString()
  status: OrderStatus;
}
