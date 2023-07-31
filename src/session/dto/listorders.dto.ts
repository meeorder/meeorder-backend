import { OrdersSchema } from '@/schema/order.schema';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsNumber, ValidateNested } from 'class-validator';

export class OrdersListDto {
  @ApiProperty({ type: Number, description: 'table number' })
  @IsNumber()
  table: number;
  @ApiProperty({ type: Number, description: 'total price' })
  @IsNumber()
  total_price: number;
  @ApiProperty({ type: Number, description: 'discount price' })
  @IsNumber()
  discount_price: number;
  @ApiProperty({ type: Number, description: 'net price' })
  @IsNumber()
  net_price: number;
  @ApiProperty({ type: () => OrdersSchema, isArray: true })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrdersSchema)
  orders: OrdersSchema[];
}
