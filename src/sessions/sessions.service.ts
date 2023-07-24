import { OrdersClass } from '@/schema/order.schema';
import { Bill } from '@/sessions/classes/bill';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { randomInt } from 'crypto';
import { Model, Types } from 'mongoose';

@Injectable()
export class SessionsService {
  constructor(
    @InjectModel('orders') private readonly orderModel: Model<OrdersClass>,
  ) {}
  async listOrderBySession(id: string) {
    const response = new Bill();
    response.table = randomInt(1, 10); //wait Table
    response.total_price = randomInt(1, 1000); // wait Menu
    response.discount_price = 0;
    response.net_price = response.total_price - response.discount_price;
    response.orders = await this.orderModel.find({
      session: new Types.ObjectId(id),
    });
    return response;
  }
}
