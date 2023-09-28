import { AddonSchema } from '@/schema/addons.schema';
import { IngredientSchema } from '@/schema/ingredients.schema';
import { OrderCancelSchema } from '@/schema/order.cancel.schema';
import { ApiProperty } from '@nestjs/swagger';
import { Ref } from '@typegoose/typegoose';

export class OrderCancelResponseDto extends OrderCancelSchema {
  @ApiProperty({ type: () => IngredientSchema, isArray: true })
  ingredients: Ref<IngredientSchema>[];

  @ApiProperty({ type: () => AddonSchema, isArray: true })
  addons: Ref<AddonSchema>[];
}
