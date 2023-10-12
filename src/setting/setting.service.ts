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
      await this.createSettings();
      return await this.settingModel.findOne().exec();
    }
    return settings;
  }

  async createSettings() {
    const settings = await this.settingModel.create({
      name: null,
      logo: null,
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
}