import { TableSchema } from '@/schema/table.schema';
import { Module } from '@nestjs/common';
import { TypegooseModule } from 'nest-typegoose';
import { TableController } from './table.controller';
import { TableService } from './table.service';

@Module({
  imports: [TypegooseModule.forFeature([TableSchema])],
  providers: [TableService],
  controllers: [TableController],
  exports: [TableService],
})
export class TableModule {}
