import { OrderStatus } from '@/orders/enums/orders.status';
import { OrdersSchema } from '@/schema/order.schema';
import { SessionSchema } from '@/schema/session.schema';
import { ReturnModelType } from '@typegoose/typegoose';
import { after, binding, when } from 'cucumber-tsflow';
import expect from 'expect';
import { Workspace } from 'features/step-definitions/workspace';
import { Types } from 'mongoose';

@binding([Workspace])
export class OrderStepDefination {
  private readonly sessionModel: ReturnModelType<typeof SessionSchema>;
  private readonly orderModel: ReturnModelType<typeof OrdersSchema>;

  constructor(private readonly workspace: Workspace) {
    this.orderModel = this.workspace.datasource.getModel(OrdersSchema);
    this.sessionModel = this.workspace.datasource.getModel(SessionSchema);
  }

  private orderId: string;

  @when('create order')
  async createOrder() {
    await this.sessionModel.create({
      table: 1,
      uid: null,
      _id: new Types.ObjectId('64cfe636970bec4e46724a45'),
      finished_at: null,
    });
    this.workspace.response = await this.workspace.axiosInstance.post(
      '/orders',
      {
        session: '64cfe636970bec4e46724a45',
        orders: [
          {
            menu: '64cfb7512219122e426138e4',
            addons: ['5f9d88b9c3b9c3b9c3b9c3bc'],
            additional_info: 'info',
          },
        ],
      },
    );
  }

  @when('get all orders')
  async getAllOrders() {
    this.workspace.response = await this.workspace.axiosInstance.get('/orders');
    this.orderId = this.workspace.response.data[0]._id;
    expect(this.workspace.response.data.length).toBe(1);
    expect(this.workspace.response.data[0].status).toBe(OrderStatus.InQueue);
  }

  @when('update order to preparing')
  async updateOrderStatus() {
    this.workspace.response = await this.workspace.axiosInstance.patch(
      `/orders/${this.orderId}/preparing`,
    );
  }

  @when('update order to ready to serve')
  async updateOrderStatusToReady() {
    this.workspace.response = await this.workspace.axiosInstance.patch(
      `/orders/${this.orderId}/ready_to_serve`,
    );
  }

  @when('update order to done')
  async updateOrderStatusToDone() {
    this.workspace.response = await this.workspace.axiosInstance.patch(
      `/orders/${this.orderId}/done`,
    );
  }

  @after()
  async cleanUpDb() {
    await this.orderModel.deleteMany({});
    await this.sessionModel.deleteMany({});
  }
}
