import { CreateOrderDto } from '@/orders/dto/order.create.dto';
import { OrderStatus } from '@/orders/enums/orders.status';
import { OrdersSchema } from '@/schema/order.schema';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ReturnModelType } from '@typegoose/typegoose';
import { Types } from 'mongoose';
import { InjectModel } from 'nest-typegoose';

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(OrdersSchema)
    private readonly orderModel: ReturnModelType<typeof OrdersSchema>,
  ) {}

  async createOrder(createOrderDto: CreateOrderDto) {
    const insertObject = createOrderDto.orders.map((food_element) => {
      const element = new OrdersSchema();
      element.session = new Types.ObjectId(createOrderDto.session);
      element.menu = new Types.ObjectId(food_element.menu);
      element.addons = food_element.addons?.map(
        (addons_element) => new Types.ObjectId(addons_element),
      );
      element.additional_info = food_element.additional_info;
      return element;
    });
    await this.orderModel.insertMany(insertObject);
  }

  async getOrders() {
    return await this.orderModel.find().exec();
  }

  async preparing(id: Types.ObjectId) {
    const element = await this.orderModel.findById(id).exec();
    if (element.cancelled_at !== null) {
      throw new HttpException(
        'Order has been cancelled',
        HttpStatus.BAD_REQUEST,
      );
    }
    await element.updateOne({ status: OrderStatus.Preparing }).exec();
  }

  async readyToServe(id: Types.ObjectId) {
    const element = await this.orderModel.findById(id).exec();
    if (element.cancelled_at !== null) {
      throw new HttpException(
        'Order has been cancelled',
        HttpStatus.BAD_REQUEST,
      );
    }
    await element.updateOne({ status: OrderStatus.ReadyToServe }).exec();
  }

  async done(id: Types.ObjectId) {
    const element = await this.orderModel.findById(id).exec();
    if (element.cancelled_at !== null) {
      throw new HttpException(
        'Order has been cancelled',
        HttpStatus.BAD_REQUEST,
      );
    }
    await element.updateOne({ status: OrderStatus.Done }).exec();
  }

  async cancel(id: Types.ObjectId) {
    await this.orderModel
      .findOneAndUpdate({ _id: id }, { cancelled_at: new Date() })
      .exec();
  }

  async getOrdersBySession(session: Types.ObjectId) {
    return await this.orderModel.find({ session }).exec();
  }
}
