import { CreateOrderDto } from './dto/order.create.dto';
import { OrdersService } from './orders.service';
import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { UpdateOrderDto } from './dto/order.update.dto';
import { ApiTags } from '@nestjs/swagger';

@Controller('orders')
@ApiTags('orders')
export class OrdersController {
  constructor(private ordersService: OrdersService) {}

  @Get()
  get_orders() {
    return this.ordersService.get_orders();
  }

  @Post()
  create_order(@Body() createOrderDto: CreateOrderDto) {
    return this.ordersService.create_order(createOrderDto);
  }

  @Patch('/:id')
  update_order(@Param('id') id: string, @Body() new_status: UpdateOrderDto) {
    return this.ordersService.update_order_status(id, new_status);
  }
}
