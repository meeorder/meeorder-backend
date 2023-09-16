import { IngredientSchema } from '@/schema/ingredients.schema';
import { DataTable } from '@cucumber/cucumber';
import { ReturnModelType } from '@typegoose/typegoose';
import { after, binding, given, then, when } from 'cucumber-tsflow';
import expect from 'expect';
import { Workspace } from 'features/step-definitions/workspace';
import { Types } from 'mongoose';

@binding([Workspace])
export class IngredientSteps {
  private readonly ingredientModel: ReturnModelType<typeof IngredientSchema>;

  constructor(private readonly workspace: Workspace) {
    this.ingredientModel = this.workspace.datasource.getModel(IngredientSchema);
  }

  @given('ingredients')
  async givenIngredients(dt: DataTable) {
    const ingredients = dt.hashes();
    for (const ingredient of ingredients) {
      await this.ingredientModel.create({
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

  @then('ingredient {string} should be disabled')
  async shouldBeDisabled(id: string) {
    const doc = await this.ingredientModel
      .findById(id)
      .select('available')
      .lean()
      .exec();
    expect(doc.available).toBeFalsy();
  }

  @after()
  async cleanUpDb() {
    await this.ingredientModel.deleteMany({});
  }
}
