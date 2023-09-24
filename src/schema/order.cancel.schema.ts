import { AddonSchema } from '@/schema/addons.schema';
import { IngredientSchema } from '@/schema/ingredients.schema';
import { ApiProperty } from '@nestjs/swagger';
import { Ref, modelOptions, prop } from '@typegoose/typegoose';

@modelOptions({
  schemaOptions: {
    timestamps: {
      createdAt: 'cancelled_at',
      updatedAt: false,
    },
  },
})
export class OrderCancelSchema {
  @prop({ default: [], type: String })
  @ApiProperty({ type: String })
  reasons: string[];

  @prop({ ref: () => IngredientSchema, default: [], autopopulate: true })
  @ApiProperty({ type: String, isArray: true })
  ingredients: Ref<IngredientSchema>[];

  @prop({ ref: () => AddonSchema, default: [], autopopulate: true })
  @ApiProperty({ type: String, isArray: true })
  addons: Ref<AddonSchema>[];

  @ApiProperty({ type: Date })
  cancelled_at: Date;

  constructor(base: Partial<OrderCancelSchema>) {
    Object.assign(this, base);
  }
}
