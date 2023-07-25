import { OrdersSchema } from '@/schema/order.schema';
import { Bill } from '@/sessions/classes/bill';
import { Injectable } from '@nestjs/common';
import { ReturnModelType } from '@typegoose/typegoose';
import { randomInt } from 'crypto';
import { Types } from 'mongoose';
import { InjectModel } from 'nest-typegoose';

@Injectable()
export class SessionsService {
  constructor(
    @InjectModel(OrdersSchema)
    private readonly orderModel: ReturnModelType<typeof OrdersSchema>,
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
