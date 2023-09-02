import { AddonsModule } from '@/addons/addons.module';
import { AuthMiddleware } from '@/auth/auth.middleware';
import { MenusModule } from '@/menus/menus.module';
import { OrdersModule } from '@/orders/orders.module';
import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypegooseModule } from 'nest-typegoose';
import { AuthModule } from './auth/auth.module';
import { CategoriesModule } from './categories/categories.module';
import { configuration } from './config';
import { TypegooseConfigService } from './config/typegoose.config.service';
import { HealthModule } from './health/health.module';
import { SessionModule } from './session/session.module';
import { TablesModule } from './tables/tables.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    HealthModule,
    CategoriesModule,
    AddonsModule,
    MenusModule,
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal: true,
    }),
    TypegooseModule.forRootAsync({
      useClass: TypegooseConfigService,
    }),
    OrdersModule,
    SessionModule,
    TablesModule,
    AuthModule,
    UsersModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes({
      path: '(.*)',
      method: RequestMethod.ALL,
    });
  }
}
