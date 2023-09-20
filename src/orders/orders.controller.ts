import { AddonsService } from '@/addons/addons.service';
import { Role } from '@/decorator/roles.decorator';
import { IngredientsService } from '@/ingredients/ingredients.service';
import { CancelOrderDto } from '@/orders/dto/cancel-order.dto';
import { CreateOrderDto } from '@/orders/dto/order.create.dto';
import { OrderGetDto } from '@/orders/dto/order.get.dto';
import { OrderStatus } from '@/orders/enums/orders.status';
import { ParseMongoIdPipe } from '@/pipes/mongo-id.pipe';
import { UserRole } from '@/schema/users.schema';
import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Types } from 'mongoose';
import { OrdersService } from './orders.service';

@Controller({ path: 'orders', version: '1' })
@ApiTags('orders')
export class OrdersController {
  constructor(
    private readonly ordersService: OrdersService,
    private readonly addonsService: AddonsService,
    private readonly ingredientService: IngredientsService,
  ) {}

  @Post()
  @ApiResponse({ status: HttpStatus.CREATED, description: 'Create order' })
  @ApiOperation({
    summary: 'Create order',
  })
  @HttpCode(HttpStatus.CREATED)
  async createOrder(@Body() createOrderDto: CreateOrderDto) {
    return await this.ordersService.createOrder(createOrderDto);
  }

  @Get()
  @ApiResponse({
    status: HttpStatus.OK,
    type: () => OrderGetDto,
    isArray: true,
  })
  @ApiOperation({
    summary: 'Get all orders',
  })
  @ApiBearerAuth()
  @Role(UserRole.Employee)
  @HttpCode(HttpStatus.OK)
  getOrders() {
    return this.ordersService.getOrders();
  }

  @Patch('/:id/preparing')
  @ApiParam({ name: 'id', type: String, description: 'Session ID (ObjectId)' })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Set order status to preparing',
  })
  @ApiOperation({
    summary: 'Change order status to preparing',
  })
  @ApiBearerAuth()
  @Role(UserRole.Employee)
  @HttpCode(HttpStatus.NO_CONTENT)
  async preparing(@Param('id', new ParseMongoIdPipe()) id: Types.ObjectId) {
    await this.ordersService.setStatus(
      new Types.ObjectId(id),
      OrderStatus.Preparing,
    );
  }

  @Patch('/:id/ready_to_serve')
  @ApiParam({ name: 'id', type: String, description: 'Session ID (ObjectId)' })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Set order status to ready to serve',
  })
  @ApiOperation({
    summary: 'Change order status to ready to serve',
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiBearerAuth()
  @Role(UserRole.Employee)
  async readyToServe(@Param('id', new ParseMongoIdPipe()) id: Types.ObjectId) {
    await this.ordersService.setStatus(
      new Types.ObjectId(id),
      OrderStatus.ReadyToServe,
    );
  }

  @Patch('/:id/done')
  @ApiParam({ name: 'id', type: String, description: 'Session ID (ObjectId)' })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Set order status to done',
  })
  @ApiOperation({
    summary: 'Change order status to done',
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiBearerAuth()
  @Role(UserRole.Employee)
  async done(@Param('id', new ParseMongoIdPipe()) id: Types.ObjectId) {
    await this.ordersService.setStatus(
      new Types.ObjectId(id),
      OrderStatus.Done,
    );
  }

  @Patch(':id/cancel')
  @ApiParam({ name: 'id' })
  @ApiNotFoundResponse()
  @ApiNoContentResponse()
  @ApiOperation({
    summary: 'Cancel order',
    description: 'Cancel order and disable addons, ingredients if included',
  })
  @ApiBearerAuth()
  @Role(UserRole.Employee)
  @HttpCode(HttpStatus.NO_CONTENT)
  async cancelOrder(
    @Body() { ingredients, addons, reason }: CancelOrderDto,
    @Param('id', new ParseMongoIdPipe()) id: Types.ObjectId,
  ) {
    const op = await this.ordersService.cancel(id, reason);
    if (op.matchedCount === 0) {
      throw new NotFoundException({ message: 'Order not found' });
    }
    await this.addonsService.disableAddons(addons);
    await this.ingredientService.disableIngredients(ingredients);
  }
}
