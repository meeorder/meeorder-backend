import { AddonSchema } from '@/schema/addons.schema';
import { DataTable } from '@cucumber/cucumber';
import { ReturnModelType } from '@typegoose/typegoose';
import { after, binding, given, then, when } from 'cucumber-tsflow';
import expect from 'expect';
import { Workspace } from 'features/step-definitions/workspace';
@binding([Workspace])
export class AddonstepDefination {
  private readonly addonModel: ReturnModelType<typeof AddonSchema>;

  constructor(private readonly workspace: Workspace) {
    this.addonModel = this.workspace.datasource.getModel(AddonSchema);
  }

  @given('addons')
  async givenAddons(dt: DataTable) {
    const addons = dt.hashes();
    for (const addon of addons) {
      await this.addonModel.create({
        title: addon.title,
        _id: addon._id,
        price: +addon.price,
        deleted_at: addon.deleted_at ? new Date(addon.deleted_at) : null,
      });
    }
  }

  @when('get all addons with status {string}')
  async getAllAddons(status: string) {
    this.workspace.response = await this.workspace.axiosInstance.get(
      '/addons',
      {
        params: {
          status,
        },
      },
    );
  }

  @when('get addon by id {string}')
  async getAddonById(id: string) {
    this.workspace.response = await this.workspace.axiosInstance.get(
      `/addons/${id}`,
    );
  }

  @when('create a addon')
  async createAddon(dt: DataTable) {
    const addon = dt.hashes()[0];
    this.workspace.response = await this.workspace.axiosInstance.post(
      '/addons',
      {
        title: addon.title,
        price: +addon.price,
      },
    );
  }

  @when('delete addon by id {string}')
  async deleteAddonById(id: string) {
    this.workspace.response = await this.workspace.axiosInstance.delete(
      `/addons/${id}`,
    );
  }

  @then('should addon appear in database')
  async shouldAddonAppearInDatabase() {
    const addon = await this.addonModel.findOne({
      title: this.workspace.response.data.title,
    });
    expect(addon).toBeTruthy();
  }

  @when('update addon by id {string}')
  async updateAddonById(id: string, dt: DataTable) {
    const addon = dt.hashes()[0];
    this.workspace.response = await this.workspace.axiosInstance.put(
      `/addons/${id}`,
      {
        title: addon.title,
        price: +addon.price,
      },
    );
  }

  @after()
  async cleanUpDb() {
    await this.addonModel.deleteMany({});
  }
}
