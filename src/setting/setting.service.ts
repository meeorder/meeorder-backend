import { SettingSchema } from '@/schema/setting.schema';
import { Injectable } from '@nestjs/common';
import { ReturnModelType } from '@typegoose/typegoose';
import { InjectModel } from 'nest-typegoose';

@Injectable()
export class SettingService {
  constructor(
    @InjectModel(SettingSchema)
    private readonly settingModel: ReturnModelType<typeof SettingSchema>,
  ) {}

  async getSettings() {
    const settings = await this.settingModel.find();
    return settings[0];
  }

  async createSettings(name: string, logo: string) {
    const settings = await this.settingModel.create({
      name,
      logo,
    });
    return settings;
  }

  async updateSettings(name: string, logo: string) {
    const settings_id = await this.settingModel.find()[0]._id;
    const settings = await this.settingModel.findOneAndUpdate(
      { _id: settings_id },
      {
        $set: {
          name,
          logo,
        },
      },
      {
        new: true,
      },
    );
    return settings;
  }
}
