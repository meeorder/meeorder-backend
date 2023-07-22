import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { OrderStatus } from '../enums/orders.status';

export class UpdateOrderDto {
  @ApiProperty()
  @IsString()
  id: string; // use string becasuse I use objectID validator in the pipe.
  @ApiProperty({ enum: OrderStatus, default: OrderStatus.in_queue })
  @IsString()
  status: OrderStatus;
}
