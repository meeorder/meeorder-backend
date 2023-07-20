import { Types } from 'mongoose';
import { CreateOrderDto } from './dto/order.create.dto';
import { OrdersService } from './orders.service';
import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  HttpException,
  Query,
} from '@nestjs/common';

@Controller('orders')
export class OrdersController {
  constructor(private ordersService: OrdersService) {}

  @Get() // Request type : GET /api/v1/orders
  get_orders() {
    return this.ordersService.get_orders();
  }

  @Post() // Request type : POST /api/v1/orders
  create_order(@Body() createOrderDto: CreateOrderDto) {
    return this.ordersService.create_order(createOrderDto);
  }

  @Patch('/:id') // Request type : PATCH /api/v1/orders/:id with status param (example : /api/v1/orders/ObjectID?status=Cooking)
  update_status_order(
    @Param('id') id: string,
    @Query('status') status: string,
  ) {
    if (!Types.ObjectId.isValid(id)) {
      throw new HttpException('Invalid order id', 400);
    }
    return this.ordersService.update_status_order(
      new Types.ObjectId(id),
      status,
    );
  }
}
