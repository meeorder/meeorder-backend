import { IngredientSchema } from '@/schema/ingredients.schema';
import { DataTable } from '@cucumber/cucumber';
import { ReturnModelType } from '@typegoose/typegoose';
import { binding, given, then, when } from 'cucumber-tsflow';
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

  @when('get ingredient by id {string}')
  async getIngredientById(id: string) {
    this.workspace.response = await this.workspace.axiosInstance.get(
      `/ingredients/${id}`,
    );
  }

  @when('get all ingredients')
  async getAllIngredients() {
    this.workspace.response = await this.workspace.axiosInstance.get(
      '/ingredients',
    );

    console.log(this.workspace.response.data);
  }

  @then("should ingredient at index {int} be")
  async shouldIngredientAtIndex(index: number, dt: DataTable) {
    const expected = Workspace.responseDtMapType(
      <{ key: string; value: string; type: string }[]>dt.hashes(),
    );

    for (const expectItem of expected) {
      expect(
        this.workspace.response.data[index][expectItem.key],
      ).toEqual(expectItem.value);
    }
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

  // @after()
  // async cleanUpDb() {
  //   await this.ingredientModel.deleteMany({});
  // }
}
