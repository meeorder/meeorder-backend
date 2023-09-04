import { AddonsService } from '@/addons/addons.service';
import { MenusService } from '@/menus/menus.service';
import { OrdersService } from '@/orders/orders.service';
import { AddonSchema } from '@/schema/addons.schema';
import { CouponSchema } from '@/schema/coupons.schema';
import { MenuSchema } from '@/schema/menus.schema';
import { SessionSchema } from '@/schema/session.schema';
import { UserSchema } from '@/schema/users.schema';
import { CouponDto } from '@/session/dto/getcoupon.dto';
import { SessionUserUpdateDto } from '@/session/dto/update-sessionUser.dto';
import { UpdateSessionCouponDto } from '@/session/dto/updatecoupon.dto';
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
    @InjectModel(UserSchema)
    private readonly userModel: ReturnModelType<typeof UserSchema>,
    @InjectModel(CouponSchema)
    private readonly couponModel: ReturnModelType<typeof CouponSchema>,
    private readonly menusService: MenusService,
    private readonly addonsService: AddonsService,
    @Inject(forwardRef(() => OrdersService))
    private readonly ordersService: OrdersService,
  ) {}

  async createSession(table: Types.ObjectId) {
    const session = await this.sessionModel.create({
      table,
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

    const session = await this.sessionModel.findById({ _id: id });
    await this.userModel.updateOne(
      { _id: session.user, deleted_at: null },
      { point: session.point },
    );

    return result;
  }

  async getSessionByTable(
    table: Types.ObjectId,
  ): Promise<DocumentType<SessionSchema>> {
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

  async validateTableHasSession(table: Types.ObjectId) {
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
      .then((doc) => <Types.ObjectId>(<SessionSchema>doc.session).table);
    res.orders = orders;
    return res;
  }

  async updateSessionUser(id: Types.ObjectId, userbody: SessionUserUpdateDto) {
    const new_user = userbody.user;
    const new_point = (await this.userModel.findById(new_user)).point;
    await this.sessionModel
      .updateOne({ _id: id }, { user: new_user, point: new_point })
      .orFail()
      .exec();
  }

  async getAllCoupon(id: Types.ObjectId): Promise<CouponDto[]> {
    const all_res = new Array<CouponDto>();
    const orders = await this.ordersService.getOrdersBySession(id);
    const menu_arr = orders.map((order) => order.menu);
    const coupon_arr = await this.couponModel.find({ activated: true });
    for (let j = 0; j < coupon_arr.length; j++) {
      let isUseable = false;
      const menus_ = coupon_arr[j].required_menus;
      for (let k = 0; k < menus_.length; k++) {
        for (let i = 0; i < menu_arr.length; i++) {
          if (menu_arr[i] === menus_[k]) {
            isUseable = true;
            break;
          }
        }
      }
      const res = new CouponDto(coupon_arr[j].toObject(), isUseable);
      all_res.push(res);
    }
    return all_res;
  }

  async updateSessionCoupon(
    id: Types.ObjectId,
    couponbody: UpdateSessionCouponDto,
  ) {
    const session = await this.sessionModel.findById(id);
    const coupon = await this.couponModel.findById(session.coupon);
    const new_coupon = couponbody.coupon_id;
    console.log(new_coupon);
    let new_point = 0;
    if (new_coupon === null) {
      const coupon_point = coupon.required_point;
      new_point = session.point + coupon_point;
    } else if (new_coupon !== session.coupon) {
      const old_coupon_point = session.coupon ? coupon.required_point : 0;
      const new_coupon_point = (await this.couponModel.findById(new_coupon))
        .required_point;
      new_point = session.point + old_coupon_point - new_coupon_point;
    }
    await this.sessionModel
      .updateOne({ _id: id }, { coupon: new_coupon, point: new_point })
      .orFail()
      .exec();
  }
}
