import { AddonsModule } from '@/addons/addons.module';
import { AuthGuard } from '@/auth/auth.guard';
import { MenusModule } from '@/menus/menus.module';
import { OrdersModule } from '@/orders/orders.module';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { TypegooseModule } from 'nest-typegoose';
import { AuthModule } from './auth/auth.module';
import { CategoriesModule } from './categories/categories.module';
import { configuration } from './config';
import { TypegooseConfigService } from './config/typegoose.config.service';
import { CouponsModule } from './coupons/coupons.module';
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
    CouponsModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class AppModule {}
