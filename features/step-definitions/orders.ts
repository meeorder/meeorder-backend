import { OrdersSchema } from '@/schema/order.schema';
import { SessionSchema } from '@/schema/session.schema';
import { DataTable } from '@cucumber/cucumber';
import { ReturnModelType } from '@typegoose/typegoose';
import { after, binding, given, then, when } from 'cucumber-tsflow';
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

  @given('orders')
  async givenOrders(dt: DataTable) {
    const orders = dt.hashes();

    for (const order of orders) {
      const doc = await this.orderModel.create({
        session: new Types.ObjectId(order.session),
        menu: new Types.ObjectId(order.menu),
        addons: order.addons?.split(',') ?? [],
        additional_info: order.additional_info,
        _id: new Types.ObjectId(order._id),
        status: order.status,
      });

      expect(doc).toBeDefined();
    }
  }

  @when('create order')
  async createOrder(dt: DataTable) {
    const order = dt.hashes()[0];
    this.workspace.response = await this.workspace.axiosInstance.post(
      '/orders',
      {
        session: order.session,
        orders: [
          {
            menu: order.menu,
            addons: order.addon?.split(',') ?? [],
            ingredients: order.ingredient?.split(',') ?? [],
            additional_info: 'info',
          },
        ],
      },
    );
  }

  @when('get all orders')
  async getAllOrders() {
    this.workspace.response = await this.workspace.axiosInstance.get('/orders');
  }

  @when('update order {string} to in queue')
  async updateOrderStatusToInQueue(order: string) {
    this.workspace.response = await this.workspace.axiosInstance.patch(
      `/orders/${order}/in_queue`,
    );
  }

  @when('update order {string} to preparing')
  async updateOrderStatus(order: string) {
    this.workspace.response = await this.workspace.axiosInstance.patch(
      `/orders/${order}/preparing`,
    );
  }

  @when('update order {string} to ready to serve')
  async updateOrderStatusToReady(order: string) {
    this.workspace.response = await this.workspace.axiosInstance.patch(
      `/orders/${order}/ready_to_serve`,
    );
  }

  @when('update order {string} to done')
  async updateOrderStatusToDone(order: string) {
    this.workspace.response = await this.workspace.axiosInstance.patch(
      `/orders/${order}/done`,
    );
  }

  @when('cancel order {string}')
  async cancelOrder(id: string, dt: DataTable) {
    const payload = dt.hashes()[0];
    this.workspace.response = await this.workspace.axiosInstance.patch(
      `/orders/${id}/cancel`,
      {
        addons: payload.addons?.split(',') ?? [],
        ingredients: payload.ingredients?.split(',') ?? [],
        reason: payload.reason?.split(',') ?? [],
      },
    );
  }

  @when('delete order {string}')
  async deleteOrder(id: string) {
    this.workspace.response = await this.workspace.axiosInstance.delete(
      `/orders/${id}`,
    );
  }

  @then('order {string} status should be {string}')
  async expectOrderShouldBeInQueue(id: string, status: string) {
    const order = await this.orderModel.findById(id).lean().exec();
    expect(order.status).toBe(status);
  }

  @then('order {string} should be cancelled')
  async expectOrderShouldBeCancelled(id: string) {
    const order = await this.orderModel.findById(id).lean().exec();
    expect(order.cancelled_at).toBeTruthy();
  }

  @then('order {string} should be deleted')
  async expectOrderShouldBeDeleted(id: string) {
    const order = await this.orderModel.findById(id).lean().exec();
    expect(order.deleted_at).toBeTruthy();
  }

  @after()
  async cleanUpDb() {
    await this.orderModel.deleteMany({});
    await this.sessionModel.deleteMany({});
  }
}
