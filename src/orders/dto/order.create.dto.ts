import { ApiProperty } from '@nestjs/swagger';
import { IsString, Validate } from 'class-validator';
import { OrderStatus } from '../enums/orders.status';
import { IsObjectId } from '@/validator/mongoose.objectid.validator';
export class CreateOrderDto {
  @ApiProperty({ enum: OrderStatus, default: OrderStatus.in_queue })
  status: OrderStatus;
  @ApiProperty()
  @IsString()
  uid: string;
  @ApiProperty({ example: 'ObjectID from MongoDB food collection schema' })
  @Validate(IsObjectId)
  food: string;
}
