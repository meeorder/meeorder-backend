import { CreateOrderDto } from '@/orders/dto/order.create.dto';
import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { OrdersService } from './orders.service';

@Controller('orders')
@ApiTags('orders')
export class OrdersController {
  constructor(private ordersService: OrdersService) {}
  @Post()
  @ApiTags('orders')
  @HttpCode(201)
  async CreateOrder(@Body() createorderdto: CreateOrderDto) {
    return await this.ordersService.CreateOrder(createorderdto);
  }
}
