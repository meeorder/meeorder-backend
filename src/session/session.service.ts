import { AddonsService } from '@/addons/addons.service';
import { MenusService } from '@/menus/menus.service';
import { OrdersService } from '@/orders/orders.service';
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
      uid,
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

  async findMenuPrice(id: Types.ObjectId, addons?: Types.ObjectId[]) {
    const menu = await this.menusService.findOneMenu(id.toString());
    const total_price = menu.price;
    let addonsPrice = 0;
    if (addons) {
      for (const item of addons) {
        const addon = await this.addonsService.getAddonById(item.toString());
        addonsPrice += addon.price;
      }
    }
    return total_price + addonsPrice;
  }

  async listOrdersBySession(id: Types.ObjectId): Promise<OrdersListDto> {
    const res = new OrdersListDto();
    const orders = await this.ordersService.getOrdersBySession(id);
    const sessions = await this.getSessionById(id);
    res.total_price = 0;
    for (const item of orders) {
      res.total_price += await this.findMenuPrice(item.menu, item.addons);
    }
    res.discount_price = 0; // wait coupon
    res.net_price = res.total_price - res.discount_price;
    res.table = <number>sessions.table;
    res.orders = orders;
    return res;
  }
}
