import { AddonsModule } from '@/addons/addons.module';
import { IngredientsModule } from '@/ingredients/ingredients.module';
import { OrdersSchema } from '@/schema/order.schema';
import { SessionModule } from '@/session/session.module';
import { Module, forwardRef } from '@nestjs/common';
import { TypegooseModule } from 'nest-typegoose';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';

@Module({
  imports: [
    TypegooseModule.forFeature([OrdersSchema]),
    forwardRef(() => SessionModule),
    AddonsModule,
    IngredientsModule,
  ],
  providers: [OrdersService],
  controllers: [OrdersController],
  exports: [OrdersService],
})
export class OrdersModule {}
