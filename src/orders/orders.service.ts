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
    if (!isValidObjectId(order.food)) {
      throw new HttpException('Invalid food id', 400);
    }
    const newOrder = new this.orderModel();
    newOrder.uid = order.uid;
    newOrder.food = new Types.ObjectId(order.food);
    await newOrder.save();
    return { status: 'success', data: newOrder };
  }
  async get_orders() {
    return await this.orderModel.find().exec();
  }
  async update_order_status(id: string, UpdateOrder: UpdateOrderDto) {
    if (!isValidObjectId(id)) {
      throw new HttpException('Invalid order id', 400);
    }
    if (!Object.values(OrderStatus).includes(UpdateOrder.status)) {
      throw new HttpException('Invalid order status', 400);
    }
    return {
      status: 'success',
      data: await this.orderModel.findByIdAndUpdate(
        new Types.ObjectId(id),
        {
          status: UpdateOrder.status,
        },
        { new: true },
      ),
    };
  }
}
