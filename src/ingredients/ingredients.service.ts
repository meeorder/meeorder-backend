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
    return await this.ingredientModel.create(ingredientInfo);
  }

  async getAllIngredient() {
    return await this.ingredientModel.find().exec();
  }

  async getIngredientById(id: string) {
    return await this.ingredientModel.findById(id).exec();
  }

  async updateIngredient(id: string, ingredientInfo: UpdateIngredientDto) {
    return await this.ingredientModel
      .findByIdAndUpdate(id, ingredientInfo)
      .exec();
  }

  async deleteIngredient(id: string) {
    const doc = await this.ingredientModel.findByIdAndRemove(id);
    if (!doc) {
      throw new Error('Ingredient not found');
    }
    return { message: 'Ingredient deleted' };
  }

  async updateIngredientToUnavailable(id: string) {
    await this.ingredientModel.updateOne({ _id: id }, { available: false });
  }

  async updateIngredientToAvailable(id: string) {
    await this.ingredientModel.updateOne({ _id: id }, { available: true });
  }
}
