import { CategorySchema } from '@/schema/categories.schema';
import { DataTable } from '@cucumber/cucumber';
import { ReturnModelType } from '@typegoose/typegoose';
import { after, binding, given, then, when } from 'cucumber-tsflow';
import expect from 'expect';
import { Workspace } from 'features/step-definitions/workspace';
import { Types } from 'mongoose';

@binding([Workspace])
export class CategoriesStepDefination {
  private readonly categoryModel: ReturnModelType<typeof CategorySchema>;

  constructor(private readonly workspace: Workspace) {
    this.categoryModel = this.workspace.datasource.getModel(CategorySchema);
  }

  @given('categories')
  async givenCategories(dt: DataTable) {
    const categories = dt.hashes();
    for (const category of categories) {
      const doc = await this.categoryModel.create({
        title: category.title,
        _id: new Types.ObjectId(category._id),
        rank: category.rank ? +category.rank : null,
        menus: category.menus?.split(',') ?? [],
      });

      expect(doc._id.toHexString()).toBe(category._id);
    }
  }

  @when('create a category')
  async createCategory(dt: DataTable) {
    const category = dt.hashes()[0];
    this.workspace.response = await this.workspace.axiosInstance.post(
      '/categories',
      {
        title: category.title,
      },
    );
  }

  @then('should category appear in database')
  async shouldCategoryAppearInDatabase() {
    const category = await this.categoryModel.findOne({
      title: this.workspace.response.data.title,
    });
    expect(category).toBeTruthy();
  }

  @when('get category by id {string}')
  async getCategoryById(id: string) {
    this.workspace.response = await this.workspace.axiosInstance.get(
      `/categories/${id}`,
    );
  }

  @when('update category at id {string}')
  async updateCategoryAtId(id: string, dt: DataTable) {
    const category = dt.hashes()[0];
    this.workspace.response = await this.workspace.axiosInstance.patch(
      `/categories/${id}`,
      {
        title: category.title,
        rank: +category.rank,
      },
    );
  }

  @when('delete category at id {string}')
  async deleteCategoryAtId(id: string) {
    this.workspace.response = await this.workspace.axiosInstance.delete(
      `/categories/${id}`,
    );
  }

  @when('get all categories')
  async getAllSessions() {
    this.workspace.response =
      await this.workspace.axiosInstance.get('/categories');
  }

  @when('update cateogries rank')
  async updateCategoriesRank(dt: DataTable) {
    const ranks = dt.hashes()[0];
    this.workspace.response = await this.workspace.axiosInstance.patch(
      '/categories/rank',
      {
        rank: ranks.rank.split(','),
      },
    );
  }

  @after()
  async cleanUpDb() {
    await this.categoryModel.deleteMany({});
  }
}
