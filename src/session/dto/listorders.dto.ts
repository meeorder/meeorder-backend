import { OrdersResponseDto } from '@/orders/dto/orders.response.dto';
import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsArray, IsNumber, ValidateNested } from 'class-validator';
import { Types } from 'mongoose';

export class OrdersListDto {
  @ApiProperty({ type: String, description: 'table id' })
  @Transform(({ value }) => new Types.ObjectId(value))
  table: Types.ObjectId;

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
