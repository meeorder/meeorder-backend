import { CreateMenuDto } from '@/menus/dto/menus.createMenu.dto';
import { MenuSchema } from '@/schema/menus.schema';
import { ReturnModelType, getModelForClass } from '@typegoose/typegoose';
import { binding, given, then, when } from 'cucumber-tsflow';
import expect from 'expect';
import { Workspace } from 'features/step-definitions/workspace';

@binding([Workspace])
export class MenuTest {
  private readonly menuModel: ReturnModelType<typeof MenuSchema>;

  constructor(private readonly workspace: Workspace) {
    this.menuModel = getModelForClass(MenuSchema, {
      existingConnection: this.workspace.mongooseConnection,
    });
  }

  private menuData: CreateMenuDto;

  private menuId: string;

  @given('a menu')
  givenMenu() {
    this.menuData = {
      image: 'https://via.placeholder.com/150',
      name: 'Menu 1',
      description: 'Menu 1 description',
      price: 100,
      category: '5f9d88b9c3b9c3b9c3b9c3be',
      addons: ['5f9d88b9c3b9c3b9c3b9c3bc', '5f9d88b9c3b9c3b9c3b9c3bb'],
    };
  }

  @when('create a menu')
  async createMenu() {
    this.workspace.response = await this.workspace.axiosInstance.post(
      '/menus',
      this.menuData,
    );

    this.menuId = this.workspace.response.data._id;
  }

  @when('should return a same menu id when get by the same id')
  async getMenu() {
    this.workspace.response = await this.workspace.axiosInstance.get(
      `/menus/${this.menuId}`,
    );

    expect(this.workspace.response.data._id).toBe(this.menuId);
  }

  @when('delete this menu')
  async deleteMenu() {
    this.workspace.response = await this.workspace.axiosInstance.delete(
      `/menus/${this.menuId}`,
    );

    expect(this.workspace.response.data.deletedCount).toBe(1);
  }

  @then('update this menu with name {string}')
  async updateMenu(newName: string) {
    this.workspace.response = await this.workspace.axiosInstance.put(
      `/menus/${this.menuId}`,
      {
        name: newName,
      },
    );
  }

  @then('menu name should be {string} when get by the same id')
  async shouldHaveName(newName: string) {
    this.workspace.response = await this.workspace.axiosInstance.get(
      `/menus/${this.menuId}`,
    );

    expect(this.workspace.response.data.name).toBe(newName);
  }
}
