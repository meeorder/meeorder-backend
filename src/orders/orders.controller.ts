import { OrdersService } from './orders.service';
import { Controller, Get } from '@nestjs/common';

@Controller('orders')
export class OrdersController {
  constructor(private ordersService: OrdersService) {}
  @Get()
  get() {
    return this.ordersService.findAll();
  }
}
