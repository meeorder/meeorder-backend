import { CategorySchema } from '@/schema/categories.schema';
import { IngredientSchema } from '@/schema/ingredients.schema';
import { MenuSchema } from '@/schema/menus.schema';
import { ApiProperty } from '@nestjs/swagger';
import { Ref } from '@typegoose/typegoose';

export class PopulatedCategoryIngredientMenuDto extends MenuSchema {
  @ApiProperty({ type: () => CategorySchema })
  category: Ref<CategorySchema>;

  @ApiProperty({ type: () => IngredientSchema, isArray: true })
  ingredients: Ref<IngredientSchema>[];
}
