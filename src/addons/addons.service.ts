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
    return await this.addonModel.find({ delete_at: null }).exec();
  }

  async getAddonById(id: string) {
    return await this.addonModel.findOne({ _id: id, delete_at: null }).exec();
  }

  async updateAddon(id: string, updateaddon: CreateAddonDto) {
    return await this.addonModel
      .findOneAndUpdate({ _id: id, delete_at: null }, updateaddon, {
        new: true,
      })
      .exec();
  }

  deleteAddon(id: string) {
    return this.addonModel
      .updateOne({ _id: id }, { delete_at: new Date() })
      .exec();
  }
}
