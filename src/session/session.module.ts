import { MenusModule } from '@/menus/menus.module';
import { OrdersModule } from '@/orders/orders.module';
import { SessionSchema } from '@/schema/session.schema';
import { Module, forwardRef } from '@nestjs/common';
import { TypegooseModule } from 'nest-typegoose';
import { SessionController } from './session.controller';
import { SessionService } from './session.service';

@Module({
  imports: [
    TypegooseModule.forFeature([SessionSchema]),
    forwardRef(() => OrdersModule),
    MenusModule,
  ],
  providers: [SessionService],
  controllers: [SessionController],
  exports: [SessionService],
})
export class SessionModule {}
