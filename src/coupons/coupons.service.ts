import { CouponSchema } from '@/schema/coupons.schema';
import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
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

  async getAllCoupons() {
    const docs = await this.couponModel.find().exec();
    if (!docs) {
      throw new NotFoundException('Coupons not found');
    }
    return docs;
  }

  async getCouponById(id: string) {
    const doc = await this.couponModel.findById(id).exec();
    if (!doc) {
      throw new NotFoundException('Coupon not found');
    }
    return doc;
  }

  async updateCoupon(id: string, couponData: UpdateCouponDto) {
    const doc = await this.couponModel.findByIdAndUpdate(id, couponData).exec();
    if (!doc) {
      throw new NotFoundException('Coupon not found');
    }
    return doc;
  }

  async deleteCoupon(id: string) {
    const doc = await this.couponModel.findByIdAndRemove(id).exec();
    if (!doc) {
      throw new NotFoundException('Coupon not found');
    }
    return { message: 'Coupon deleted' };
  }

  async redeemCoupon(id: string) {
    const doc = await this.getCouponById(id);

    if (doc.redeemed === doc.quota) {
      throw new ConflictException('Coupon quota reached');
    }

    doc.redeemed += 1;
    await doc.save();

    return doc;
  }

  async refundCoupon(id: string) {
    const doc = await this.getCouponById(id);

    if (doc.redeemed === 0) {
      throw new ConflictException(
        'Coupon cannot be refunded, redeemed:' + doc.redeemed,
      );
    }

    doc.redeemed -= 1;
    await doc.save();
  }
}
