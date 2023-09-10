import { MenuSchema } from '@/schema/menus.schema';
import { DataTable } from '@cucumber/cucumber';
import { ReturnModelType } from '@typegoose/typegoose';
import { after, binding, given, then, when } from 'cucumber-tsflow';
import expect from 'expect';
import { Workspace } from 'features/step-definitions/workspace';
@binding([Workspace])
export class MenuTest {
  private readonly menuModel: ReturnModelType<typeof MenuSchema>;

  constructor(private readonly workspace: Workspace) {
    this.menuModel = this.workspace.datasource.getModel(MenuSchema);
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

  @given('menus')
  async givenMenus(dt: DataTable) {
    const menus = dt.hashes();
    for (const menu of menus) {
      this.workspace.response = await this.workspace.axiosInstance.post(
        '/menus',
        {
          _id: menu._id,
          title: menu.title,
          price: +menu.price,
          category: menu.category ? menu.category : undefined,
          addons: menu.addons ? menu.addons.split(',') : undefined,
        },
      );
    }
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

  @after()
  async cleanUpDB() {
    await this.menuModel.deleteMany({});
  }
}
