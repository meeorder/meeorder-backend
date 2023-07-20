import { Injectable } from '@nestjs/common';

@Injectable()
export class OrdersService {
  findAll(): string {
    return 'This action returns all orders';
  }
}
