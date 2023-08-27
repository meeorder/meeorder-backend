import { CreateOrderDto } from '@/orders/dto/order.create.dto';
import { OrderGetDto } from '@/orders/dto/order.get.dto';
import { OrderStatus } from '@/orders/enums/orders.status';
import { OrdersSchema } from '@/schema/order.schema';
import { SessionService } from '@/session/session.service';
import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  forwardRef,
} from '@nestjs/common';
import { ReturnModelType } from '@typegoose/typegoose';
import { Types } from 'mongoose';
import { InjectModel } from 'nest-typegoose';

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(OrdersSchema)
    private readonly orderModel: ReturnModelType<typeof OrdersSchema>,
    @Inject(forwardRef(() => SessionService))
    private readonly sessionService: SessionService,
  ) {}

  async createOrder(createOrderDto: CreateOrderDto) {
    const session = await this.sessionService.getSessionById(
      new Types.ObjectId(createOrderDto.session),
    );
    if (session.finished_at !== null) {
      throw new HttpException(
        'Session has been finished',
        HttpStatus.BAD_REQUEST,
      );
    }
    const insertObject = createOrderDto.orders.map((food_element) => {
      const element = new OrdersSchema();
      element.session = new Types.ObjectId(createOrderDto.session);
      element.menu = new Types.ObjectId(food_element.menu);
      element.addons = food_element.addons?.map(
        (addons_element) => new Types.ObjectId(addons_element),
      );
      element.additional_info = food_element.additional_info;
      return element;
    });
    await this.orderModel.insertMany(insertObject);
  }

  async getOrders(): Promise<OrderGetDto[]> {
    // join orders and session with session id
    return await this.orderModel
      .aggregate([
        {
          $lookup: {
            from: 'sessions',
            localField: 'session',
            foreignField: '_id',
            as: 'session',
          },
        },
        {
          $project: {
            _id: 1,
            created_at: 1,
            status: 1,
            menu: 1,
            addons: 1,
            additional_info: 1,
            cancelled_at: 1,
            session: {
              $arrayElemAt: ['$session', 0],
            },
          },
        },
        {
          $match: {
            'session.finished_at': null,
          },
        },
        {
          $lookup: {
            from: 'menus',
            localField: 'menu',
            foreignField: '_id',
            as: 'menu',
          },
        },
        {
          $project: {
            _id: 1,
            created_at: 1,
            status: 1,
            menu: {
              $arrayElemAt: ['$menu', 0],
            },
            addons: 1,
            additional_info: 1,
            cancelled_at: 1,
            session: 1,
          },
        },
      ])
      .exec();
  }

  async setStatus(id: Types.ObjectId, status: OrderStatus) {
    const element = await this.orderModel.findById(id).exec();
    if (element.cancelled_at !== null) {
      throw new HttpException(
        'Order has been cancelled',
        HttpStatus.BAD_REQUEST,
      );
    }
    await element.updateOne({ status }).exec();
  }

  async cancel(id: Types.ObjectId) {
    await this.orderModel
      .findOneAndUpdate({ _id: id }, { cancelled_at: new Date() })
      .exec();
  }

  async getOrdersBySession(session: Types.ObjectId) {
    return await this.orderModel.find({ session }).exec();
  }
}
