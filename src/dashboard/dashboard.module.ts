import { DashboardController } from '@/dashboard/dashboard.controller';
import { DashboardService } from '@/dashboard/dashboard.service';
import { ReceiptSchema } from '@/schema/receipt.schema';
import { UserSchema } from '@/schema/users.schema';
import { UsersModule } from '@/users/users.module';
import { Module } from '@nestjs/common';
import { TypegooseModule } from 'nest-typegoose';

@Module({
  imports: [
    TypegooseModule.forFeature([UserSchema, ReceiptSchema]),
    UsersModule,
  ],
  providers: [DashboardService],
  controllers: [DashboardController],
  exports: [DashboardService],
})
export class DashboardModule {}
