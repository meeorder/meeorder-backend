import { CouponSchema } from '@/schema/coupons.schema';
import { Module } from '@nestjs/common';
import { TypegooseModule } from 'nest-typegoose';
import { CouponsController } from './coupons.controller';
import { CouponsService } from './coupons.service';
@Module({
  imports: [TypegooseModule.forFeature([CouponSchema])],
  controllers: [CouponsController],
  providers: [CouponsService],
  exports: [CouponsService],
})
export class CouponsModule {}
