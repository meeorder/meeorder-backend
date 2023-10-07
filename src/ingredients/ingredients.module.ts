import { LoggerModule } from '@/logger/logger.module';
import { IngredientSchema } from '@/schema/ingredients.schema';
import { Module } from '@nestjs/common';
import { TypegooseModule } from 'nest-typegoose';
import { IngredientsController } from './ingredients.controller';
import { IngredientsService } from './ingredients.service';

@Module({
  imports: [TypegooseModule.forFeature([IngredientSchema]), LoggerModule],
  controllers: [IngredientsController],
  providers: [IngredientsService],
  exports: [IngredientsService],
})
export class IngredientsModule {}
