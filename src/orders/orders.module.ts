import { OrdersSchema } from '@/schema/order.schema';
import { Module } from '@nestjs/common';
import { TypegooseModule } from 'nest-typegoose';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';

@Module({
  imports: [TypegooseModule.forFeature([OrdersSchema])],
  providers: [OrdersService],
  controllers: [OrdersController],
})
export class OrdersModule {}
