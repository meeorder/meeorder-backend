import { CreateOrderDto } from '@/orders/dto/order.create.dto';
import { OrdersClass } from '@/schema/order.schema';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel('orders') private readonly orderModel: Model<OrdersClass>,
  ) {}
  async createOrder(createorderdto: CreateOrderDto) {
    const insertObject = new Array(createorderdto.orders.length);
    createorderdto.orders.forEach((food_element) => {
      const element = new OrdersClass();
      element.session = new Types.ObjectId(createorderdto.session);
      element.menu = new Types.ObjectId(food_element.menu);
      element.addons = food_element.addons.map(
        (addons_element) => new Types.ObjectId(addons_element),
      );
      element.additional_info = food_element.additional_info;
      insertObject.push(element);
    });
    this.orderModel.insertMany(insertObject);
  }
}
