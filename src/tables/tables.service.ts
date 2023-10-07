import { OrderStatus } from '@/orders/enums/orders.status';
import { AddonSchema } from '@/schema/addons.schema';
import { CouponSchema } from '@/schema/coupons.schema';
import { MenuSchema } from '@/schema/menus.schema';
import { OrdersSchema } from '@/schema/order.schema';
import { SessionSchema } from '@/schema/session.schema';
import { TablesSchema } from '@/schema/tables.schema';
import { TableResponseDto } from '@/tables/dto/tables.response.dto';
import { Injectable } from '@nestjs/common';
import { ReturnModelType } from '@typegoose/typegoose';
import { InjectModel } from 'nest-typegoose';

@Injectable()
export class TablesService {
  constructor(
    @InjectModel(TablesSchema)
    private readonly tablesModel: ReturnModelType<typeof TablesSchema>,
  ) {}

  async createTable(title: string) {
    return await this.tablesModel.create({ title });
  }

  async getTables(): Promise<TableResponseDto[]> {
    const tables = await this.tablesModel
      .find()
      .populate({
        path: 'session',
        match: { finished_at: null },
        model: 'SessionSchema',
        populate: [
          {
            path: 'orders',
            model: 'OrderSchema',
            populate: [
              {
                path: 'menu',
                model: 'MenuSchema',
              },
              {
                path: 'addons',
                model: 'AddonSchema',
              },
            ],
          },
          {
            path: 'coupon',
            model: 'CouponSchema',
          },
        ],
      })
      .exec();

    const res = tables.map((table) => {
      const t = new TableResponseDto();
      t._id = table._id;
      t.title = table.title;

      if (table.session) {
        const session = <SessionSchema>table.session;
        const coupon = <CouponSchema>session.coupon;
        t.session = session._id;
        t.session_create_at = session.created_at;
        t.allOrdersCount = session.orders.length;
        t.unfinishOrdersCount = session.orders.filter((o) => {
          const order = <OrdersSchema>o;
          return order.status !== OrderStatus.Done;
        }).length;
        t.totalPrice =
          session.orders
            .map((o) => {
              const order = <OrdersSchema>o;
              const orderMenu = <MenuSchema>order.menu;
              const price = orderMenu.price;
              const totalAddonsPrice = order.addons.reduce((acc, add) => {
                const addon = <AddonSchema>add;
                return acc + addon.price;
              }, 0);
              return price + totalAddonsPrice;
            })
            .reduce((acc, price) => acc + price, 0) -
          (coupon ? coupon.discount : 0);
      } else {
        t.session = null;
        t.session_create_at = null;
        t.allOrdersCount = 0;
        t.unfinishOrdersCount = 0;
        t.totalPrice = 0;
      }

      t.created_at = table.created_at;

      return t;
    });

    return res;
  }
}
