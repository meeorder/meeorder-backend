import { OrdersClass } from '@/schema/order.schema';
import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Types, Model, isValidObjectId } from 'mongoose';
import { CreateOrderDto } from './dto/order.create.dto';
import { UpdateOrderDto } from './dto/order.update.dto';
import { OrderStatus } from './enums/orders.status';

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel('orders') private readonly orderModel: Model<OrdersClass>,
  ) {}

  async create_order(order: CreateOrderDto) {
    // Check if the food id is valid
    if (!isValidObjectId(order.food)) {
      throw new HttpException('Invalid food id', 400);
    }
    // Check if the status is not in OrderStatus enum
    if (!Object.values(OrderStatus).includes(order.status)) {
      throw new HttpException('Invalid order status', 400);
    }

    // Create new Order
    const newOrder = new this.orderModel();
    newOrder.status = await order.status;
    // uid is userID
    newOrder.uid = await order.uid;
    newOrder.food = new Types.ObjectId(order.food);
    await newOrder.save();
    return { status: 'success', data: newOrder };
  }
  async get_orders() {
    return await this.orderModel.find().exec();
  }
  async update_order_status(UpdateOrder: UpdateOrderDto) {
    // Check if the order id is valid
    if (!isValidObjectId(UpdateOrder.id)) {
      throw new HttpException('Invalid order id', 400);
    }
    // Check if the status is not in OrderStatus enum
    if (!Object.values(OrderStatus).includes(UpdateOrder.status)) {
      throw new HttpException('Invalid order status', 400);
    }
    // Check if the order is exist
    if (!(await this.orderModel.findById(UpdateOrder.id))) {
      throw new HttpException('Order not found', 404);
    }
    // Update the order status if the order is exist and the status is valid
    await this.orderModel.findByIdAndUpdate(UpdateOrder.id, {
      status: UpdateOrder.status,
    });
    return {
      status: 'success',
      data: await this.orderModel.findById(UpdateOrder.id),
    };
  }
}
