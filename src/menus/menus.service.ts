import { CreateMenuDto } from '@/menus/dto/menus.createMenu.dto';
import { DeleteMenusDto } from '@/menus/dto/menus.deleteMenus.dto';
import { GetAllMenuResponseDto } from '@/menus/dto/menus.getAllMenuResponse.dto';
import { GetMenuByIdResponseDto } from '@/menus/dto/menus.getMenuByIdReponse.dto';
import { MenuSchema } from '@/schema/menus.schema';
import { UpdateResponseDto } from '@/utils/dto/updateResponse.dto';
import { Injectable } from '@nestjs/common';
import { ReturnModelType } from '@typegoose/typegoose';
import { Types } from 'mongoose';
import { InjectModel } from 'nest-typegoose';
import { DeleteResponseDto } from '../utils/dto/deleteResponse.dto';
@Injectable()
export class MenusService {
  constructor(
    @InjectModel(MenuSchema)
    private readonly menuModel: ReturnModelType<typeof MenuSchema>,
  ) {}

  async findAllMenus(): Promise<GetAllMenuResponseDto[]> {
    const script = [
      { $match: { _id: { $exists: true } } },
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
        },
      },
    ];

    const result = await this.menuModel.aggregate(script).exec();
    return result;
  }

  async findOneMenu(id: string): Promise<GetMenuByIdResponseDto> {
    const script = [
      {
        $match: { _id: new Types.ObjectId(id) },
      },
      {
        $unwind: '$addons', // Unwind the "addon" array to prepare for the $lookup stage
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
    const menu = await this.menuModel.aggregate(script).exec();
    return menu[0];
  }

  async createMenu(menuData: CreateMenuDto): Promise<MenuSchema> {
    const createdMenu = await this.menuModel.create(menuData);
    return createdMenu;
  }

  async updateOne(
    id: string,
    menuData: CreateMenuDto,
  ): Promise<UpdateResponseDto> {
    const updatedMenu = await this.menuModel
      .updateOne({ _id: id }, menuData)
      .exec();
    return updatedMenu;
  }

  async deleteOneMenu(id: string): Promise<DeleteResponseDto> {
    const deletedMenu = await this.menuModel.deleteOne({ _id: id }).exec();
    return deletedMenu;
  }

  async deleteManyMenus(data: DeleteMenusDto): Promise<DeleteResponseDto> {
    const deleteManyScript = {
      _id: { $in: data.ids },
    };
    const deletedMenus = await this.menuModel
      .deleteMany(deleteManyScript)
      .exec();
    return deletedMenus;
  }
}
