import { OrdersModule } from '@/orders/orders.module';
import { OrdersSchema } from '@/schema/order.schema';
import { SessionsService } from '@/sessions/sessions.service';
import { Module } from '@nestjs/common';
import { TypegooseModule } from 'nest-typegoose';
import { SessionsController } from './sessions.controller';

@Module({
  imports: [OrdersModule, TypegooseModule.forFeature([OrdersSchema])],
  providers: [SessionsService],
  controllers: [SessionsController],
})
export class SessionsModule {}
