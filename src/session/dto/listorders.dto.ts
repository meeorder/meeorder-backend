import { OrdersResponseDto } from '@/orders/dto/orders.response.dto';
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

  @ApiProperty({ type: () => OrdersResponseDto, isArray: true })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrdersResponseDto)
  orders: OrdersResponseDto[];
}
