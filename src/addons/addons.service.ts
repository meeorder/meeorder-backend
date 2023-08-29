import { CreateAddonDto } from '@/addons/dto/addon.dto';
import { AddonSchema } from '@/schema/addons.schema';
import { Injectable } from '@nestjs/common';
import { ReturnModelType } from '@typegoose/typegoose';
import { InjectModel } from 'nest-typegoose';

@Injectable()
export class AddonsService {
  constructor(
    @InjectModel(AddonSchema)
    private readonly addonModel: ReturnModelType<typeof AddonSchema>,
  ) {}

  async createAddon(title: string, price: number) {
    return await this.addonModel.create({
      title,
      price,
    });
  }

  async getAllAddons() {
    const doc = await this.addonModel.find({ deleted_at: null }).exec();
    return doc;
  }

  async getAddonById(id: string) {
    const doc = await this.addonModel
      .findOne({ _id: id, deleted_at: null })
      .exec();
    return doc;
  }

  async updateAddon(id: string, updateAddon: CreateAddonDto) {
    return await this.addonModel
      .findOneAndUpdate({ _id: id, deleted_at: null }, updateAddon, {
        new: true,
      })
      .exec();
  }

  deleteAddon(id: string) {
    return this.addonModel
      .updateOne({ _id: id }, { deleted_at: new Date() })
      .orFail()
      .exec();
  }
}
