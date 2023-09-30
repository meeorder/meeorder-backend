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

  getOrders() {
    return this.orderModel
      .find({ deleted_at: null })
      .populate('addons')
      .populate({
        path: 'session',
        match: { finished_at: null },
        populate: { path: 'table' },
      })
      .populate({
        path: 'menu',
        populate: { path: 'category' },
      })
      .populate('cancel.ingredients')
      .populate('cancel.addons')
      .lean()
      .exec();
  }

  async setStatus(id: Types.ObjectId, status: OrderStatus) {
    const element = await this.orderModel.findById(id).exec();
    if (element.cancel !== null) {
      throw new HttpException(
        'Order has been cancelled',
        HttpStatus.BAD_REQUEST,
      );
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
