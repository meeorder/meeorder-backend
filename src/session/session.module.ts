import { AddonsModule } from '@/addons/addons.module';
import { CouponsModule } from '@/coupons/coupons.module';
import { MenusModule } from '@/menus/menus.module';
import { OrdersModule } from '@/orders/orders.module';
import { ReceiptModule } from '@/receipt/receipt.module';
import { CouponSchema } from '@/schema/coupons.schema';
import { SessionSchema } from '@/schema/session.schema';
import { UserSchema } from '@/schema/users.schema';
import { Module, forwardRef } from '@nestjs/common';
import { TypegooseModule } from 'nest-typegoose';
import { SessionController } from './session.controller';
import { SessionService } from './session.service';

@Module({
  imports: [
    TypegooseModule.forFeature([SessionSchema, UserSchema, CouponSchema]),
    forwardRef(() => OrdersModule),
    CouponsModule,
    MenusModule,
    AddonsModule,
    ReceiptModule,
  ],
  providers: [SessionService],
  controllers: [SessionController],
  exports: [SessionService],
})
export class SessionModule {}
