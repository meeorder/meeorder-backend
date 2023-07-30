import { CreateMenuDto } from '@/menus/dto/menus.createMenu.dto';
import { GetAllMenuResponseDto } from '@/menus/dto/menus.getAllMenuResponse.dto';
import { GetMenuByIdResponseDto } from '@/menus/dto/menus.getMenuByIdReponse.dto';
import { MenuSchema } from '@/schema/menus.schema';
import { Injectable } from '@nestjs/common';
import { ReturnModelType } from '@typegoose/typegoose';
import { Types } from 'mongoose';
import { InjectModel } from 'nest-typegoose';
@Injectable()
export class MenusService {
  constructor(
    @InjectModel(MenuSchema)
    private readonly menuModel: ReturnModelType<typeof MenuSchema>,
  ) {}

  private readonly getAddonInfoScript = [
    {
      $unwind: {
        path: '$addons',
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $lookup: {
        from: 'addons', // The name of the "addon" collection
        localField: 'addons', // The field in the "menus" collection to match with
        foreignField: '_id', // The field in the "addon" collection to match with
        as: 'addonInfo', // The alias for the joined data, you can use any name you prefer
      },
    },

    {
      $unwind: {
        path: '$addonInfo',
        preserveNullAndEmptyArrays: true, // Preserve documents even if no matching addon is found
      },
    },
    {
      $group: {
        _id: '$_id', // Group by the original _id from "menus"
        otherFields: { $first: '$$ROOT' }, // Preserve other fields from "menus"
        addonInfo: { $push: '$addonInfo' }, // Create an array of addonInfo objects
      },
    },
    {
      $replaceRoot: {
        newRoot: {
          $mergeObjects: ['$otherFields', { addons: '$addonInfo' }], // Merge the "otherFields" and "addonInfo" objects
        },
      },
    },
    {
      $project: {
        addonInfo: 0, // Remove the addonInfo field
      },
    },
  ];

  private readonly groupCategoryScript = [
    {
      $lookup: {
        from: 'categories',
        localField: 'category',
        foreignField: '_id',
        as: 'categoryInfo',
      },
    },
    { $unwind: '$categoryInfo' },
    {
      $group: {
        _id: '$category',
        categoryInfo: { $first: '$categoryInfo' },
        menus: { $push: '$$ROOT' },
      },
    },
    {
      $replaceRoot: {
        newRoot: {
          $mergeObjects: [{ category: '$categoryInfo' }, { menus: '$menus' }],
        },
      },
    },
    {
      $project: {
        'menus.categoryInfo': 0,
        'menus.category': 0,
      },
    },
  ];

  async findAllMenus(status: string): Promise<GetAllMenuResponseDto[]> {
    let scriptForStatus = {};
    if (status === 'published') {
      scriptForStatus = { published_at: { $ne: null }, deleted_at: null };
    } else if (status === 'draft') {
      scriptForStatus = { published_at: null, deleted_at: null };
    } else if (status === 'all') {
      scriptForStatus = { deleted_at: null };
    }
    const script = [
      { $match: { _id: { $exists: true } } },
      { $match: scriptForStatus },
      ...this.getAddonInfoScript,
      ...this.groupCategoryScript,
    ];

    const result = await this.menuModel.aggregate(script).exec();
    return result;
  }

  async findOneMenu(id: string): Promise<GetMenuByIdResponseDto> {
    const script = [
      {
        $match: { _id: new Types.ObjectId(id) },
      },
      ...this.getAddonInfoScript,
    ];
    const menu = await this.menuModel.aggregate(script).exec();
    return menu[0];
  }

  async createMenu(menuData: CreateMenuDto): Promise<MenuSchema> {
    const createdMenu = await this.menuModel.create(menuData);
    return createdMenu;
  }

  async updateOne(id: string, menuData: CreateMenuDto) {
    await this.menuModel.updateOne({ _id: id }, menuData).exec();
  }

  async deleteOneMenu(id: string) {
    const currentDate = new Date();
    await this.menuModel.updateOne({ _id: id }, { deleted_at: currentDate });
  }

  async deleteManyMenus(ids: Types.ObjectId[]) {
    const currentDate = new Date();
    const deleteManyScript = {
      _id: { $in: ids },
    };
    await this.menuModel.updateMany(deleteManyScript, {
      deleted_at: currentDate,
    });
  }

  async publishMenu(id: string) {
    const currentDate = new Date();
    await this.menuModel.updateOne({ _id: id }, { published_at: currentDate });
  }

  async unpublishMenu(id: string) {
    await this.menuModel.updateOne({ _id: id }, { published_at: null });
  }
}
