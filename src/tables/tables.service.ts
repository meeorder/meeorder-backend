import { OrderStatus } from '@/orders/enums/orders.status';
import { AddonSchema } from '@/schema/addons.schema';
import { CouponSchema } from '@/schema/coupons.schema';
import { MenuSchema } from '@/schema/menus.schema';
import { OrdersSchema } from '@/schema/order.schema';
import { SessionSchema } from '@/schema/session.schema';
import { TablesSchema } from '@/schema/tables.schema';
import { TablesResponseDto } from '@/tables/dto/tables.response.dto';
import { ErrorDto } from '@/utils/errors/error.dto';
import { Injectable, NotFoundException } from '@nestjs/common';
import { DocumentType, ReturnModelType } from '@typegoose/typegoose';
import { Types } from 'mongoose';
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

  async getTables(): Promise<TablesResponseDto[]> {
    const tables = await this.tablesModel
      .find({ deleted_at: null })
      .populate({
        path: 'session',
        match: { finished_at: null },
        populate: [
          {
            path: 'orders',
            populate: [
              {
                path: 'menu',
              },
              {
                path: 'addons',
              },
            ],
          },
          {
            path: 'coupon',
          },
        ],
      })
      .lean()
      .exec();

    const res = tables.map((table) => {
      const t = new TablesResponseDto();
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
          return ![OrderStatus.Done, OrderStatus.Cancelled].includes(
            order.status,
          );
        }).length;
        t.totalPrice =
          session.orders
            .map((o) => {
              const order = <OrdersSchema>o;

              if (order.status === OrderStatus.Cancelled) {
                return 0;
              }

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

  deleteTable(id: Types.ObjectId) {
    return this.tablesModel
      .updateOne(
        { _id: id },
        {
          $set: {
            deleted_at: new Date(),
          },
        },
      )
      .orFail(new NotFoundException(new ErrorDto('Table not found')))
      .exec();
  }

  updateTable(
    id: Types.ObjectId,
    table: Partial<TablesSchema>,
  ): Promise<DocumentType<TablesSchema>> {
    return this.tablesModel
      .findByIdAndUpdate(
        id,
        {
          $set: table,
        },
        { new: true },
      )
      .orFail(new NotFoundException(new ErrorDto('Table not found')))
      .exec();
  }

  getTableById(id: Types.ObjectId) {
    return this.tablesModel
      .findOne({ _id: id, deleted_at: null })
      .populate({
        path: 'session',
        populate: ['orders', 'coupon', 'user'],
      })
      .lean()
      .exec();
  }
}
