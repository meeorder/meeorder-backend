import { AddonsModule } from '@/addons/addons.module';
import { MenusModule } from '@/menus/menus.module';
import { OrdersModule } from '@/orders/orders.module';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypegooseModule } from 'nest-typegoose';
import { CategoriesModule } from './categories/categories.module';
import { configuration } from './config';
import { TypegooseConfigService } from './config/typegoose.config.service';
import { HealthModule } from './health/health.module';
import { SessionModule } from './session/session.module';
import { TablesModule } from './tables/tables.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { UdersModule } from './uders/uders.module';
import { UsersService } from './users/users.service';
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
    UdersModule,
  ],
  providers: [UsersService],
})
export class AppModule {}
