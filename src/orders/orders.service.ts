import { CreateOrderDto } from '@/orders/dto/order.create.dto';
import { OrderStatus } from '@/orders/enums/orders.status';
import { OrderCancelSchema } from '@/schema/order.cancel.schema';
import { OrdersSchema } from '@/schema/order.schema';
import { SessionService } from '@/session/session.service';
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

  async getOrders() {
    const orders = await this.orderModel.aggregate([
      {
        $match: {
          deleted_at: null,
        },
      },
      {
        $lookup: {
          from: 'sessions',
          localField: 'session',
          foreignField: '_id',
          as: 'session',
        },
      },
      {
        $unwind: {
          path: '$session',
          includeArrayIndex: '0',
          preserveNullAndEmptyArrays: false,
        },
      },
      {
        $lookup: {
          from: 'tables',
          localField: 'session.table',
          foreignField: '_id',
          as: 'session.table',
        },
      },
      {
        $unwind: {
          path: '$session.table',
          includeArrayIndex: '0',
          preserveNullAndEmptyArrays: false,
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
        $unwind: {
          path: '$menu',
          includeArrayIndex: '0',
          preserveNullAndEmptyArrays: false,
        },
      },
      {
        $lookup: {
          from: 'categories',
          localField: 'menu.category',
          foreignField: '_id',
          as: 'menu.category',
        },
      },
      {
        $lookup: {
          from: 'ingredients',
          localField: 'menu.ingredients',
          foreignField: '_id',
          as: 'menu.ingredients',
        },
      },
      {
        $unwind: {
          path: '$menu.category',
          includeArrayIndex: '0',
          preserveNullAndEmptyArrays: false,
        },
      },
      {
        $lookup: {
          from: 'ingredients',
          localField: 'cancel.ingredients',
          foreignField: '_id',
          as: 'cancel.ingredients',
        },
      },
      {
        $lookup: {
          from: 'addons',
          localField: 'cancel.addons',
          foreignField: '_id',
          as: 'cancel.addons',
        },
      },
      {
        $lookup: {
          from: 'addons',
          localField: 'addons',
          foreignField: '_id',
          as: 'addons',
        },
      },
      {
        $project: {
          '0': 0,
        },
      },
    ]);
    return orders;
  }

  async setStatus(id: Types.ObjectId, status: OrderStatus) {
    const element = await this.orderModel.findById(id).exec();
    if (element.cancel !== null) {
      element.cancel = null;
    }
    element.status = status;

    await element.save();
  }

  async deleteOrder(id: Types.ObjectId) {
    await this.orderModel
      .updateOne({ _id: id }, { deleted_at: new Date() })
      .exec();
  }

  cancel(
    id: Types.ObjectId,
    reasons: string[],
    ingredients: Types.ObjectId[],
    addons: Types.ObjectId[],
  ) {
    return this.orderModel
      .updateOne(
        { _id: id },
        {
          $set: {
            status: OrderStatus.Cancelled,
            cancel: new OrderCancelSchema({ reasons, ingredients, addons }),
          },
        },
      )
      .exec();
  }

  async getOrdersBySession(
    session: Types.ObjectId,
  ): Promise<DocumentType<OrdersSchema>[]> {
    return await this.orderModel
      .find({ session })
      .populate('menu addons')
      .exec();
  }

  updateOrder(
    id: Types.ObjectId,
    doc: Partial<OrdersSchema>,
  ): Promise<DocumentType<OrdersSchema>> {
    return this.orderModel
      .findByIdAndUpdate(
        id,
        {
          $set: doc,
        },
        {
          new: true,
        },
      )
      .exec();
  }
}
