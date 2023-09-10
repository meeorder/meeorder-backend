import { IngredientSchema } from '@/schema/ingredients.schema';
import { DataTable } from '@cucumber/cucumber';
import { binding, given, when } from 'cucumber-tsflow';
import { Workspace } from 'features/step-definitions/workspace';
import { Types } from 'mongoose';

@binding([Workspace])
export class IngredientSteps {
  constructor(private readonly workspace: Workspace) {}

  @given('ingredients')
  async givenIngredients(dt: DataTable) {
    const ingredients = dt.hashes();
    for (const ingredient of ingredients) {
      await this.workspace.datasource.getModel(IngredientSchema).create({
        _id: new Types.ObjectId(ingredient._id),
        title: ingredient.title,
        available: ingredient.available ? +ingredient.available : true,
      });
    }
  }

  @when('create an ingredient')
  async createIngredients(dt: DataTable) {
    const req = dt.hashes()[0];
    this.workspace.response = await this.workspace.axiosInstance.post(
      '/ingredients',
      {
        title: req.title,
        available: req.available,
      },
    );
  }
}
