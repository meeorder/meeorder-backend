import { ReceiptSchema } from '@/schema/receipt.schema';
import { Module } from '@nestjs/common';
import { TypegooseModule } from 'nest-typegoose';
import { ReceiptService } from './receipt.service';

@Module({
  imports: [TypegooseModule.forFeature([ReceiptSchema])],
  providers: [ReceiptService],
  exports: [ReceiptService],
})
export class ReceiptModule {}
