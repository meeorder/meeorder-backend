import { CreateAddonDto } from '@/addons/dto/addon.dto';
import { GetAddonDto } from '@/addons/dto/getaddon.dto';
import { AddonSchema } from '@/schema/addons.schema';
import { Injectable, NotFoundException } from '@nestjs/common';
import { ReturnModelType } from '@typegoose/typegoose';
import { Types } from 'mongoose';
import { InjectModel } from 'nest-typegoose';

@Injectable()
export class AddonsService {
  constructor(
    @InjectModel(AddonSchema)
    private readonly addonModel: ReturnModelType<typeof AddonSchema>,
  ) {}

  private readonly countAddonInMenusAggregation = [
    {
      $lookup: {
        from: 'menus',
        localField: '_id',
        foreignField: 'addons',
        as: 'menus',
      },
    },
    {
      $lookup: {
        from: 'addons',
        localField: '_id',
        foreignField: '_id',
        as: 'addon',
      },
    },
    {
      $project: {
        addon: { $arrayElemAt: ['$addon', 0] },
        menus: { $sum: { $size: '$menus' } },
      },
    },
  ];

  async createAddon(title: string, price: number) {
    return await this.addonModel.create({
      title,
      price,
    });
  }

  async getAllAddons(status: string): Promise<GetAddonDto[]> {
    let script = {};
    if (status === 'active') {
      script = { deleted_at: null };
    }
    const agg = await this.addonModel
      .aggregate([
        {
          $match: script,
        },
        ...this.countAddonInMenusAggregation,
      ])
      .exec();

    return agg.map((addons) => {
      return new GetAddonDto(addons.addon, addons.menus);
    });
  }

  async getAddonById(id: string): Promise<GetAddonDto> {
    return await this.getAllAddons('all').then((addons) => {
      return addons.find((addon) => addon._id.toString() === id);
    });
  }

  async updateAddon(id: string, updateAddon: CreateAddonDto) {
    return await this.addonModel
      .findOneAndUpdate({ _id: id, deleted_at: null }, updateAddon, {
        new: true,
      })
      .orFail(() => new NotFoundException('Addon not found'))
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

  setAvailable(id: Types.ObjectId, available: boolean) {
    return this.addonModel
      .updateOne({ _id: id }, { $set: { available } }, { new: true })
      .lean()
      .exec();
  }

  activateAllAddon() {
    return this.addonModel.updateMany({}, { $set: { available: true } }).exec();
  }

  async getAllIds() {
    const ids = await this.addonModel.find({}, '_id').lean().exec();
    return ids.map(({ _id }) => _id);
  }
}
