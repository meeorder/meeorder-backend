import { CouponSchema } from '@/schema/coupons.schema';
import { DataTable } from '@cucumber/cucumber';
import { ReturnModelType } from '@typegoose/typegoose';
import { after, binding, given, then, when } from 'cucumber-tsflow';
import expect from 'expect';
import { Workspace } from 'features/step-definitions/workspace';
import { Types } from 'mongoose';
@binding([Workspace])
export class SessionStepDefination {
  private readonly couponModel: ReturnModelType<typeof CouponSchema>;

  constructor(private readonly workspace: Workspace) {
    this.couponModel = this.workspace.datasource.getModel(CouponSchema);
  }

  @given('coupons')
  async givenCoupons(dt: DataTable) {
    const coupons = dt.hashes();
    for (const coupon of coupons) {
      const doc = await this.couponModel.create({
        title: coupon.title,
        price: +coupon.price,
        required_point: +coupon.required_point,
        _id: new Types.ObjectId(coupon._id),
      });

      expect(doc._id.toHexString()).toBe(coupon._id);
    }
  }

  @when('create a coupon')
  async createCoupon(dt: DataTable) {
    const coupon = dt.hashes()[0];
    this.workspace.response = await this.workspace.axiosInstance.post(
      '/coupons',
      {
        title: coupon.title,
        price: +coupon.price,
        required_point: +coupon.required_point,
      },
    );
  }

  @then('should coupon appear in database')
  async shouldCouponAppearInDatabase() {
    const coupon = await this.couponModel.findById(
      this.workspace.response.data._id,
    );
    expect(coupon).toBeTruthy();
  }

  @when('get coupon by id {string}')
  async getCouponById(id: string) {
    this.workspace.response = await this.workspace.axiosInstance.get(
      `/coupons/${id}`,
    );
  }

  @when('get all coupons by owner')
  async getAllCouponsByOwner() {
    this.workspace.response =
      await this.workspace.axiosInstance.get('/coupons');
  }

  @then('response size should equal to {int}')
  responseSizeShouldEqualTo(size: number) {
    expect(this.workspace.response.data.length).toBe(size);
  }

  @after()
  async cleanUpDb() {
    await this.couponModel.deleteMany({});
  }
}
