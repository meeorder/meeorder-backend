import { IngredientSchema } from '@/schema/ingredients.schema';
import { ApiProperty } from '@nestjs/swagger';

export class GetIngredientDto extends IngredientSchema {
  @ApiProperty()
  menus_applied: number;

  constructor(ingredient: IngredientSchema, menus_applied: number) {
    super();
    Object.assign(this, ingredient);
    this.menus_applied = menus_applied;
  }
}
