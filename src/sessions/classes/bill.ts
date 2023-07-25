import { OrdersSchema } from '@/schema/order.schema';

export class Bill {
  table: number;
  total_price: number;
  discount_price: number;
  net_price: number;
  orders: OrdersSchema[];
}
