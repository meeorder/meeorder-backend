import { CouponSchema } from '@/schema/coupons.schema';
import { Injectable } from '@nestjs/common';
import { ReturnModelType } from '@typegoose/typegoose';
import { InjectModel } from 'nest-typegoose';
import { CreateCouponDto } from './dto/create-coupon.dto';
import { UpdateCouponDto } from './dto/update-coupon.dto';

@Injectable()
export class CouponsService {
  constructor(
    @InjectModel(CouponSchema)
    private readonly couponModel: ReturnModelType<typeof CouponSchema>,
  ) {}

  async createCoupon(couponData: CreateCouponDto) {
    const doc = await this.couponModel.create(couponData);
    return doc;
  }

  async getAllCouponByOwner() {
    const docs = await this.couponModel.find();
    return docs;
  }

  async getCouponByIdByOwner(id: string) {
    const doc = await this.couponModel.findById(id);
    return doc;
  }

  async updateCoupon(id: string, couponData: UpdateCouponDto) {
    const doc = await this.couponModel.findByIdAndUpdate(id, couponData);
    return doc;
  }

  async deleteCoupon(id: string) {
    const doc = await this.couponModel.findByIdAndRemove(id);
    if (!doc) {
      throw new Error('Coupon not found');
    }
    return { message: 'Coupon deleted' };
  }
}
