import { TablesSchema } from '@/schema/tables.schema';
import { Module } from '@nestjs/common';
import { TypegooseModule } from 'nest-typegoose';
import { TablesController } from './tables.controller';
import { TablesService } from './tables.service';

@Module({
  imports: [TypegooseModule.forFeature([TablesSchema])],
  providers: [TablesService],
  controllers: [TablesController],
})
export class TablesModule {}
