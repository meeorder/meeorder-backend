import { OrdersClass } from '@/schema/order.schema';
import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Types, Model, isValidObjectId } from 'mongoose';
import { CreateOrderDto } from './dto/order.create.dto';

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel('orders') private readonly orderModel: Model<OrdersClass>,
  ) {}
  async create_order(order: CreateOrderDto): Promise<Object> {
    {
      /*
        Check if the food id is valid
      */
      if (!isValidObjectId(order.food)) {
        throw new HttpException('Invalid food id', 400);
      }

      // Create new Order
      const newOrder = new this.orderModel();
      newOrder.status = await order.status;
      // uid is the running number of the order (1,2,3,4,...)
      let running_number: number = (await this.orderModel.countDocuments()) + 1;
      newOrder.uid = running_number.toString();
      newOrder.food = new Types.ObjectId(order.food);
      await newOrder.save();
      return { status: 'success', data: newOrder };
    }
  }
  async get_orders(): Promise<Object> {
    return await this.orderModel.find().exec();
  }
  async update_status_order(
    id: Types.ObjectId,
    new_status: string,
  ): Promise<Object> {
    await this.orderModel.findByIdAndUpdate(id, { status: new_status });
    return { status: 'success', data: await this.orderModel.findById(id) };
  }
}
