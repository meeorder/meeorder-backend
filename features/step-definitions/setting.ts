import { SettingSchema } from '@/schema/setting.schema';
import { DataTable } from '@cucumber/cucumber';
import { ReturnModelType } from '@typegoose/typegoose';
import { binding, given } from 'cucumber-tsflow';
import { Workspace } from 'features/step-definitions/workspace';
import { Types } from 'mongoose';

@binding([Workspace])
export class SettingSteps {
  private readonly settingModel: ReturnModelType<typeof SettingSchema>;

  constructor(private readonly workspace: Workspace) {
    this.settingModel = this.workspace.datasource.getModel(SettingSchema);
  }

  @given('setting')
  async createSetting(dt: DataTable) {
    const setting = dt.hashes()[0];
    await this.settingModel.create({
      _id: new Types.ObjectId(setting.id),
      name: setting.name,
      logo: setting.logo,
      point_ratio: +setting.point_ratio,
    });
  }
}
