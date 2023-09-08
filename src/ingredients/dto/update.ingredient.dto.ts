import { CreateIngredientDto } from '@/ingredients/dto/create.ingredient.dto';
import { PartialType } from '@nestjs/swagger';

export class UpdateIngredientDto extends PartialType(CreateIngredientDto) {}
