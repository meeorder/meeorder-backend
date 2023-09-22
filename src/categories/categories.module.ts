import { CategorySchema } from '@/schema/categories.schema';
import { MenuSchema } from '@/schema/menus.schema';
import { Module } from '@nestjs/common';
import { TypegooseModule } from 'nest-typegoose';
import { CategoriesController } from './categories.controller';
import { CategoriesService } from './categories.service';

@Module({
  imports: [TypegooseModule.forFeature([CategorySchema, MenuSchema])],
  providers: [CategoriesService],
  controllers: [CategoriesController],
  exports: [CategoriesService],
})
export class CategoriesModule {}
