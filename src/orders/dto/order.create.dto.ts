import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { OrderStatus } from '../enums/orders.status';
export class CreateOrderDto {
  @ApiProperty({ enum: OrderStatus, default: OrderStatus.in_queue })
  status: OrderStatus;
  @ApiProperty()
  @IsString()
  uid: string;
  @ApiProperty()
  @IsString()
  food: string; // use string becasuse I use objectID validator in the pipe.
}
