import { AddonsService } from '@/addons/addons.service';
import { MenusService } from '@/menus/menus.service';
import { OrdersService } from '@/orders/orders.service';
import { AddonSchema } from '@/schema/addons.schema';
import { MenuSchema } from '@/schema/menus.schema';
import { SessionSchema } from '@/schema/session.schema';
import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  forwardRef,
} from '@nestjs/common';
import { DocumentType, ReturnModelType } from '@typegoose/typegoose';
import { Types } from 'mongoose';
import { InjectModel } from 'nest-typegoose';
import { OrdersListDto } from './dto/listorders.dto';

@Injectable()
export class SessionService {
  constructor(
    @InjectModel(SessionSchema)
    private readonly sessionModel: ReturnModelType<typeof SessionSchema>,
    private readonly menusService: MenusService,
    private readonly addonsService: AddonsService,
    @Inject(forwardRef(() => OrdersService))
    private readonly ordersService: OrdersService,
  ) {}

  async createSession(table: number, uid?: string) {
    const session = await this.sessionModel.create({
      table,
      user: uid,
    });

    return session;
  }

  async finishSession(id: Types.ObjectId) {
    const result = await this.sessionModel
      .updateOne(
        { _id: id, deleted_at: null },
        {
          finished_at: new Date(),
        },
      )
      .orFail()
      .exec();

    return result;
  }

  async getSessionByTable(table: number): Promise<DocumentType<SessionSchema>> {
    const session = await this.sessionModel
      .findOne({
        table,
        finished_at: null,
        deleted_at: null,
      })
      .exec();

    return session;
  }

  getSessionById(id: Types.ObjectId): Promise<DocumentType<SessionSchema>> {
    return this.sessionModel
      .findOne({
        _id: id,
        deleted_at: null,
      })
      .exec();
  }

  async getSessions(finished = false): Promise<DocumentType<SessionSchema>[]> {
    const sessions = await this.sessionModel
      .find({
        finished_at: finished ? { $ne: null } : null,
        deleted_at: null,
      })
      .exec();

    return sessions;
  }

  deleteSession(id: Types.ObjectId) {
    return this.sessionModel
      .updateOne({ _id: id, deleted_at: null }, { deleted_at: new Date() })
      .orFail()
      .exec();
  }

  async validateTableHasSession(table: number) {
    const doc = await this.getSessionByTable(table);
    if (doc) {
      throw new HttpException(
        `Table ${table} has session ${doc._id}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async findTotalPrice(id: Types.ObjectId): Promise<number> {
    const res = await this.sessionModel
      .aggregate([
        {
          $lookup: {
            from: 'orders',
            localField: '_id',
            foreignField: 'session',
            as: 'orders',
          },
        },
        {
          $project: {
            _id: 1,
            table: 1,
            orders: 1,
          },
        },
        {
          $lookup: {
            from: 'menus',
            localField: 'orders.menu',
            foreignField: '_id',
            as: 'menu',
          },
        },
        {
          $lookup: {
            from: 'addons',
            localField: 'orders.addons',
            foreignField: '_id',
            as: 'menu_addons',
          },
        },
        {
          $project: {
            _id: 1,
            menu: 1,
            menu_addons: 1,
          },
        },
        {
          $project: {
            menu_total: {
              $sum: '$menu.price',
            },
            addons_total: {
              $sum: '$menu_addons.price',
            },
          },
        },
        {
          $project: {
            totalprice: {
              $add: ['$menu_total', '$addons_total'],
            },
          },
        },
        {
          $match: {
            _id: id,
          },
        },
      ])
      .exec();
    return res[0].totalprice;
  }

  async listOrdersBySession(id: Types.ObjectId): Promise<OrdersListDto> {
    const res = new OrdersListDto();
    const orders = await this.ordersService.getOrdersBySession(id);
    res.total_price = orders
      .map(({ menu, addons }) => {
        const addonPrice = addons?.reduce(
          (prev, current) => prev + (<AddonSchema>current).price,
          0,
        );

        return (
          (<MenuSchema>menu).price + (Number.isNaN(addonPrice) ? 0 : addonPrice)
        );
      })
      .reduce((prev, current) => prev + current, 0);
    res.discount_price = 0; // wait coupon
    res.net_price = res.total_price - res.discount_price;
    res.table = await orders[0]
      ?.populate('session', 'table')
      .then((doc) => <number>(<SessionSchema>doc.session).table);
    res.orders = orders;
    return res;
  }
}
