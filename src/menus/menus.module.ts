import { CategoriesModule } from '@/categories/categories.module';
import { CategorySchema } from '@/schema/categories.schema';
import { MenuSchema } from '@/schema/menus.schema';
import { Module } from '@nestjs/common';
import { TypegooseModule } from 'nest-typegoose';
import { MenusController } from './menus.controller';
import { MenusService } from './menus.service';
@Module({
  imports: [
    TypegooseModule.forFeature([MenuSchema, CategorySchema]),
    CategoriesModule,
  ],
  providers: [MenusService],
  controllers: [MenusController],
  exports: [MenusService],
})
export class MenusModule {}
