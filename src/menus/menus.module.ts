import { CategoriesModule } from '@/categories/categories.module';
import { MenuSchema } from '@/schema/menus.schema';
import { Module } from '@nestjs/common';
import { TypegooseModule } from 'nest-typegoose';
import { MenusController } from './menus.controller';
import { MenusService } from './menus.service';

@Module({
  imports: [TypegooseModule.forFeature([MenuSchema]), CategoriesModule],
  providers: [MenusService],
  controllers: [MenusController],
  exports: [MenusService],
})
export class MenusModule {}
