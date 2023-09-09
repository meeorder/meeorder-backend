import { CreateAddonDto } from '@/addons/dto/addon.dto';
import { AddonSchema } from '@/schema/addons.schema';
import { Injectable } from '@nestjs/common';
import { ReturnModelType } from '@typegoose/typegoose';
import { Types } from 'mongoose';
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

  async getAllAddons(status: string) {
    let script = {};
    if (status === 'active') {
      script = { deleted_at: null };
    }
    return await this.addonModel.find(script).exec();
  }

  async getAddonById(id: string) {
    return await this.addonModel.findOne({ _id: id, deleted_at: null }).exec();
  }

  async updateAddon(id: string, updateAddon: CreateAddonDto) {
    return await this.addonModel
      .findOneAndUpdate({ _id: id, deleted_at: null }, updateAddon, {
        new: true,
      })
      .exec();
  }

  async disableAddons(addons: Types.ObjectId[]) {
    await this.addonModel
      .updateMany(
        {
          _id: {
            $in: addons,
          },
        },
        { available: false },
      )
      .exec();
  }

  deleteAddon(id: string) {
    return this.addonModel
      .updateOne({ _id: id }, { deleted_at: new Date() })
      .orFail()
      .exec();
  }
}
