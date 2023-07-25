import { CreateOrderDto } from '@/orders/dto/order.create.dto';
import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { OrdersService } from './orders.service';

@Controller('orders')
@ApiTags('orders')
export class OrdersController {
  constructor(private ordersService: OrdersService) {}
  @Post()
  @ApiTags('orders')
  @ApiBody({ type: CreateOrderDto })
  @HttpCode(HttpStatus.CREATED)
  async createOrder(@Body() createorderdto: CreateOrderDto) {
    return await this.ordersService.createOrder(createorderdto);
  }
}
