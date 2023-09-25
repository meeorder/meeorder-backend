import { CategorySchema } from '@/schema/categories.schema';
import { MenuSchema } from '@/schema/menus.schema';
import { DataTable } from '@cucumber/cucumber';
import { ReturnModelType } from '@typegoose/typegoose';
import { after, binding, given, then, when } from 'cucumber-tsflow';
import expect from 'expect';
import { Workspace } from 'features/step-definitions/workspace';
import { Types } from 'mongoose';

@binding([Workspace])
export class MenuTest {
  private readonly menuModel: ReturnModelType<typeof MenuSchema>;
  private readonly categoryModel: ReturnModelType<typeof CategorySchema>;


  constructor(private readonly workspace: Workspace) {
    this.menuModel = this.workspace.datasource.getModel(MenuSchema);
    this.categoryModel = this.workspace.datasource.getModel(CategorySchema);
  }

  async createOtherCategory() {
    const otherCategory = await this.categoryModel
        .findById("64ef35bbe6c66d526b0981f0")
        .exec();

    if (!otherCategory) {
      this.categoryModel.create({
        title: 'Others',
        _id: "64ef35bbe6c66d526b0981f0",
      });
    }
    return otherCategory;
  }

  @then('should menu id {string} can_order to be {string}')
  menuIdShouldBe(id: string, status: string) {
    const { data } = this.workspace.response;
    expect(Array.isArray(data?.[0]?.menus)).toBeTruthy();
    const menus: any[] = data?.[0]?.menus;
    const menu = menus.find((m) => m._id === id);
    expect(menu).toBeTruthy();
    expect(menu.can_order).toBe(status === 'true');
  }

  @after()
  async cleanUpDB() {
    await this.menuModel.deleteMany({});
  }

  @given('menus')
  async givenMenus(dt: DataTable) {
    const req = dt.hashes();
    await this.createOtherCategory();

    for (const doc of req) {
      const categoryId = doc.category ? new Types.ObjectId(doc.category) : new Types.ObjectId("64ef35bbe6c66d526b0981f0");

      await this.categoryModel.updateOne({
        _id: categoryId,
      }, {
        $push: {
          menus: new Types.ObjectId(doc._id),
        }
      })

      await this.menuModel.create({
        _id: new Types.ObjectId(doc._id),
        image: doc.image,
        title: doc.title,
        description: doc.description,
        price: doc.price,
        category: categoryId,
        addons: doc.addons ? doc.addons.split(',').map((v) => new Types.ObjectId(v)) : [],
        ingredients: doc.ingredients ? doc.ingredients.split(',').map((v) => new Types.ObjectId(v)) : [],
        published_at: doc.published_at ? new Date(doc.published_at) : null,
      });
    }
  }

  @when('create a menu')
  async createMenu(dt: DataTable) {
    const menu = dt.hashes()[0];
    this.workspace.response = await this.workspace.axiosInstance.post(
      '/menus',
      {
        title: menu.title,
        price: +menu.price,
      },
    );
  }

  @when('unpublish menu {string}')
  async unpublishMenu(id: string) {
    this.workspace.response = await this.workspace.axiosInstance.patch(
      `/menus/${id}/unpublish`,
    );
  }

  @when('publish menu {string}')
  async publishMenu(id: string) {
    this.workspace.response = await this.workspace.axiosInstance.patch(
      `/menus/${id}/publish`,
    );
  }

  @when('get menu by id {string}')
  async getMenuByIdFromResponse(id: string) {
    this.workspace.response = await this.workspace.axiosInstance.get(
      `/menus/${id}`,
    );
  }

  @when('get all menus with status {string}')
  async getAllMenusFromResponse(status: string) {
    this.workspace.response = await this.workspace.axiosInstance.get('/menus', {
      params: {
        status,
      },
    });
  }

  @then('should menu appear in database')
  async shouldMenuAppearInDatabase() {
    const menu = await this.menuModel.findById(
      this.workspace.response.data._id,
    );
    expect(menu).toBeTruthy();
  }

  @then('should category data be')
  shouldCategoryDataBe(dt: DataTable) {
    const expected = Workspace.responseDtMapType(
      <{ key: string; value: string; type: string }[]>dt.hashes(),
    );
    for (const expectItem of expected) {
      expect(this.workspace.response.data.category[expectItem.key]).toEqual(
        expectItem.value,
      );
    }
  }

  @then('should menu data at index {int} be')
  shouldMenuDataBeDeep(index: number, dt: DataTable) {
    const expected = Workspace.responseDtMapType(
      <{ key: string; value: string; type: string }[]>dt.hashes(),
    );

    for (const expectItem of expected) {
      console.log(this.workspace.response.data[index][expectItem.key]);
      expect(this.workspace.response.data[index][expectItem.key]).toEqual(
        expectItem.value,
      );
    }
  }

  @then('should category data at index {int} be')
  shouldCategoryDataBeDeep(index: number, dt: DataTable) {
    const expected = Workspace.responseDtMapType(
      <{ key: string; value: string; type: string }[]>dt.hashes(),
    );

    for (const expectItem of expected) {
      expect(
        this.workspace.response.data[index].category[expectItem.key],
      ).toEqual(expectItem.value);
    }
  }

  @then('should addons data at index {int} be')
  shouldAddonsDataBe(index: number, dt: DataTable) {
    const expected = Workspace.responseDtMapType(
      <{ key: string; value: string; type: string }[]>dt.hashes(),
    );

    for (const expectItem of expected) {
      expect(
        this.workspace.response.data.addons[index][expectItem.key],
      ).toEqual(expectItem.value);
    }
  }

  @then('should addons data at index [{int}][{int}][{int}] be')
  shouldAddonsDataBeDeep(
    firstIndex: number,
    secondIndex,
    thirdIndex,
    dt: DataTable,
  ) {
    const expected = Workspace.responseDtMapType(
      <{ key: string; value: string; type: string }[]>dt.hashes(),
    );

    for (const expectItem of expected) {
      expect(
        this.workspace.response.data[firstIndex].menus[secondIndex].addons[
          thirdIndex
        ][expectItem.key],
      ).toEqual(expectItem.value);
    }
  }

  @then('should ingredients data be')
  async shouldIngredientsDataBe(dt: DataTable) {
    const expected = Workspace.responseDtMapType(
      <{ key: string; value: string; type: string }[]>dt.hashes(),
    );
    for (const expectItem of expected) {
      expect(
        this.workspace.response.data.ingredients[expectItem.key],
      ).toEqual(expectItem.value);
    }
  }

  @then('should menu data at index [{int}][{int}] be')
  shouldMenuDataBe(firstIndex: number, secondIndex: number, dt: DataTable) {
    const expected = Workspace.responseDtMapType(
      <{ key: string; value: string; type: string }[]>dt.hashes(),
    );

    for (const expectItem of expected) {
      expect(
        this.workspace.response.data[firstIndex].menus[secondIndex][
          expectItem.key
        ],
      ).toEqual(expectItem.value);
    }
  }

  @when('get all menus with status {string}')
  async getAllMenus(status: string) {
    this.workspace.response = await this.workspace.axiosInstance.get(`/menus`, {
      params: {
        status,
      },
    });
  }
}