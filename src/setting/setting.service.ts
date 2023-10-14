import { SettingSchema } from '@/schema/setting.schema';
import { SettingDto } from '@/setting/dto/setting.dto';
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
    const settings = await this.settingModel.findOne().exec();
    if (settings === null) {
      return this.createDefaultSettings();
    }
    return settings;
  }

  async createDefaultSettings() {
    const settings = await this.settingModel.create({
      name: null,
      logo: null,
      point_ratio: 0,
    });
    return settings;
  }

  async updateSettings(settingDto: SettingDto) {
    const settings_id = (await this.getSettings())._id;
    const settings = await this.settingModel
      .findOneAndUpdate(
        { _id: settings_id },
        {
          $set: settingDto,
        },
        {
          new: true,
        },
      )
      .exec();
    return settings;
  }

  async getRatioPoint() {
    const doc = await this.settingModel
      .findOne({})
      .select('point_ratio')
      .exec();
    return doc?.point_ratio ?? 0;
  }
}
