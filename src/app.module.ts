import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { CategoriesModule } from './categories/categories.module';
import { configuration } from './config';
import { MongooseConfigService } from './config/mongoose.config.service';
import { HealthModule } from './health/health.module';
import { OrdersModule } from './orders/orders.module';
import { SessionsModule } from './sessions/sessions.module';

@Module({
  imports: [
    HealthModule,
    CategoriesModule,
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      useClass: MongooseConfigService,
    }),
    OrdersModule,
    SessionsModule,
  ],
})
export class AppModule {}
