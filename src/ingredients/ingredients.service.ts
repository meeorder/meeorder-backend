import { CreateIngredientDto } from '@/ingredients/dto/create.ingredient.dto';
import { UpdateIngredientDto } from '@/ingredients/dto/update.ingredient.dto';
import { IngredientSchema } from '@/schema/ingredients.schema';
import { Injectable } from '@nestjs/common';
import { ReturnModelType } from '@typegoose/typegoose';
import { InjectModel } from 'nest-typegoose';

@Injectable()
export class IngredientsService {
  constructor(
    @InjectModel(IngredientSchema)
    private readonly ingredientModel: ReturnModelType<typeof IngredientSchema>,
  ) {}

  async createIngredient(ingredientInfo: CreateIngredientDto) {
    const doc = await this.ingredientModel.create(ingredientInfo);
    return doc;
  }

  async getAllIngredient() {
    const docs = await this.ingredientModel.find();
    return docs;
  }

  async getIngredientById(id: string) {
    const doc = await this.ingredientModel.findById(id);
    return doc;
  }

  async updateIngredient(id: string, ingredientInfo: UpdateIngredientDto) {
    const doc = await this.ingredientModel.findByIdAndUpdate(
      id,
      ingredientInfo,
    );
    return doc;
  }

  async deleteIngredient(id: string) {
    const doc = await this.ingredientModel.findByIdAndRemove(id);
    if (!doc) {
      throw new Error('Ingredient not found');
    }
    return { message: 'Ingredient deleted' };
  }
}
