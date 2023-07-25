import { OrdersService } from '@/orders/orders.service';
import { Bill } from '@/sessions/classes/bill';
import { Injectable } from '@nestjs/common';
import { randomInt } from 'crypto';
import { Types } from 'mongoose';

@Injectable()
export class SessionsService {
  constructor(private readonly ordersService: OrdersService) {}
  async listOrderBySession(id: string) {
    const response = new Bill();
    response.table = randomInt(1, 10); //wait Table
    response.total_price = randomInt(1, 1000); // wait Menu
    response.discount_price = 0;
    response.net_price = response.total_price - response.discount_price;
    response.orders = await this.ordersService.findBySessionId(
      new Types.ObjectId(id),
    );
    return response;
  }
}
