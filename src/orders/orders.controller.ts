import { CreateOrderDto } from '@/orders/dto/order.create.dto';
import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { OrdersService } from './orders.service';

@Controller('orders')
@ApiTags('orders')
export class OrdersController {
  constructor(private ordersService: OrdersService) {}
  @Post()
  @ApiTags('orders')
  @ApiBody({ type: CreateOrderDto })
  @HttpCode(201)
  async createOrder(@Body() createorderdto: CreateOrderDto) {
    return await this.ordersService.createOrder(createorderdto);
  }
}
