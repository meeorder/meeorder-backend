import { CouponSchema } from '@/schema/coupons.schema';
import { CouponDto } from '@/session/dto/getcoupon.dto';
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
        discount: +coupon.discount,
        required_point: +coupon.required_point,
        quota: +coupon.quota,
        _id: new Types.ObjectId(coupon._id),
        activated: coupon.activated ?? true,
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
        discount: +coupon.discount,
        required_point: +coupon.required_point,
        quota: +coupon.quota,
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

  @when('get all coupons by session {string}')
  async getAllCouponsBySessionUser(session: string) {
    this.workspace.response = await this.workspace.axiosInstance.get(
      `/sessions/${session}/coupon/all`,
    );
    console.log(this.workspace.response.data);
  }

  @then('response size should equal to {int}')
  responseSizeShouldEqualTo(size: number) {
    expect(this.workspace.response.data.length).toBe(size);
  }

  @then('coupon response id {string} redeemable should be {string}')
  couponResponseShouldBe(id: string, redeemable: string) {
    const isRedeemable = redeemable === 'true';
    const data: CouponDto[] = this.workspace.response.data;
    expect(Array.isArray(data)).toBeTruthy();
    const coupon = data.find((coupon) => `${coupon._id}` === id);
    expect(coupon).toBeDefined();
    expect(coupon.redeemable).toEqual(isUsable);
  }

  @after()
  async cleanUpDb() {
    await this.couponModel.deleteMany({});
  }
}
