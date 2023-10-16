import { ReceiptSchema } from '@/schema/receipt.schema';
import { SessionModule } from '@/session/session.module';
import { SettingModule } from '@/setting/setting.module';
import { Module } from '@nestjs/common';
import { TypegooseModule } from 'nest-typegoose';
import { ReceiptService } from './receipt.service';

@Module({
  imports: [
    TypegooseModule.forFeature([ReceiptSchema]),
    SettingModule,
    SessionModule,
  ],
  providers: [ReceiptService],
  exports: [ReceiptService],
})
export class ReceiptModule {}
