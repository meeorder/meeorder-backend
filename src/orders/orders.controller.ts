import { CreateOrderDto } from '@/orders/dto/order.create.dto';
import { ParseMongoIdPipe } from '@/pipes/mongo-id.pipe';
import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiBody, ApiParam, ApiTags } from '@nestjs/swagger';
import { Types } from 'mongoose';
import { OrdersService } from './orders.service';

@Controller('orders')
@ApiTags('orders')
export class OrdersController {
  constructor(private ordersService: OrdersService) {}

  @Post()
  @ApiTags('orders')
  @ApiBody({ type: CreateOrderDto })
  @HttpCode(HttpStatus.CREATED)
  async createOrder(@Body() createOrderDto: CreateOrderDto) {
    return await this.ordersService.createOrder(createOrderDto);
  }

  @Get()
  @ApiTags('orders')
  @HttpCode(HttpStatus.OK)
  async getOrders() {
    return await this.ordersService.getOrders();
  }

  @Patch('/:id/preparing')
  @ApiTags('orders')
  @ApiParam({ name: 'id', type: String, description: 'Session ID (ObjectId)' })
  @HttpCode(HttpStatus.OK)
  async preparing(@Param('id', new ParseMongoIdPipe()) id: Types.ObjectId) {
    return await this.ordersService.preparing(new Types.ObjectId(id));
  }

  @Patch('/:id/ready_to_serve')
  @ApiTags('orders')
  @ApiParam({ name: 'id', type: String, description: 'Session ID (ObjectId)' })
  @HttpCode(HttpStatus.OK)
  async readyToServe(@Param('id', new ParseMongoIdPipe()) id: Types.ObjectId) {
    return await this.ordersService.readyToServe(new Types.ObjectId(id));
  }

  @Patch('/:id/done')
  @ApiTags('orders')
  @ApiParam({ name: 'id', type: String, description: 'Session ID (ObjectId)' })
  @HttpCode(HttpStatus.OK)
  async completed(@Param('id', new ParseMongoIdPipe()) id: Types.ObjectId) {
    return await this.ordersService.done(new Types.ObjectId(id));
  }

  @Patch('/:id/cancel')
  @ApiTags('orders')
  @ApiParam({ name: 'id', type: String, description: 'Session ID (ObjectId)' })
  @HttpCode(HttpStatus.OK)
  async cancel(@Param('id', new ParseMongoIdPipe()) id: Types.ObjectId) {
    return await this.ordersService.cancel(new Types.ObjectId(id));
  }
}
