import { CreateOrderDto } from '@/orders/dto/order.create.dto';
import { OrdersSchema } from '@/schema/order.schema';
import { Injectable } from '@nestjs/common';
import { ReturnModelType } from '@typegoose/typegoose';
import { Types } from 'mongoose';
import { InjectModel } from 'nest-typegoose';

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(OrdersSchema)
    private readonly orderModel: ReturnModelType<typeof OrdersSchema>,
  ) {}
  async createOrder(createorderdto: CreateOrderDto) {
    let i = 0;
    const insertObject = new Array(createorderdto.orders.length);
    createorderdto.orders.forEach((food_element) => {
      const element = new OrdersSchema();
      element.session = new Types.ObjectId(createorderdto.session);
      element.menu = new Types.ObjectId(food_element.menu);
      element.addons = food_element.addons.map(
        (addons_element) => new Types.ObjectId(addons_element),
      );
      element.additional_info = food_element.additional_info;
      insertObject[i] = element;
      i++;
    });
    this.orderModel.insertMany(insertObject);
  }
}
