import { CategoriesService } from '@/categories/categories.service';
import { CreateMenuDto } from '@/menus/dto/menus.createMenu.dto';
import { GetAllMenuResponseDto } from '@/menus/dto/menus.getAllMenuResponse.dto';
import { GetMenuByIdResponseDto } from '@/menus/dto/menus.getMenuByIdReponse.dto';
import { CategorySchema } from '@/schema/categories.schema';
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
    @InjectModel(CategorySchema)
    private readonly categoryModel: ReturnModelType<typeof CategorySchema>,
    private readonly categoriesService: CategoriesService,
  ) {}

  private readonly getAddonInfoAggregation = [
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

  private readonly groupCategoryAggregation = [
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
          // Merge the "categoryInfo" and "menus" objects
          // Also sort the "menus" field that contain array of menu object which has "_id" by order from array of "_id" in "categoryInfo.menus" field
          $mergeObjects: [
            { category: '$categoryInfo' },
            {
              menus: {
                $map: {
                  input: '$categoryInfo.menus',
                  as: 'menuId',
                  in: {
                    $arrayElemAt: [
                      {
                        $filter: {
                          input: '$menus',
                          as: 'menu',
                          cond: { $eq: ['$$menu._id', '$$menuId'] },
                        },
                      },
                      0,
                    ],
                  },
                },
              },
            },
          ],
        },
      },
    },
    {
      $sort: {
        'category.rank': 1 as any,
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
      ...this.getAddonInfoAggregation,
      ...this.groupCategoryAggregation,
    ];

    const result = await this.menuModel.aggregate(script).exec();
    return result;
  }

  async findOneMenu(id: string): Promise<GetMenuByIdResponseDto> {
    const result = await this.menuModel
      .findById(id)
      .populate('addons')
      .populate('category')
      .exec();
    return <GetMenuByIdResponseDto>result;
  }

  async createMenu(menuData: CreateMenuDto): Promise<MenuSchema> {
    if (!menuData.category) {
      // If category is not exist, set category to 'other' category
      const otherCategory = await this.categoryModel
        .findById(this.categoriesService.othersCategoryID)
        .exec();

      if (!otherCategory) {
        this.categoryModel.create({
          title: 'Others',
          _id: this.categoriesService.othersCategoryID,
        });
      }

      menuData.category = this.categoriesService.othersCategoryID;
    }

    const createdMenu = await this.menuModel.create(menuData);

    await this.categoriesService.pushMenuToCategory(
      menuData.category,
      createdMenu._id,
    );

    return createdMenu;
  }

  async updateOne(id: string, menuData: CreateMenuDto) {
    const oldMenu = await this.menuModel.findByIdAndUpdate(id, menuData).exec();

    if (oldMenu.category._id.equals(menuData.category)) {
      return;
    }

    await this.categoriesService.pullMenuFromCategory(
      oldMenu.category._id,
      oldMenu._id,
    );

    await this.categoriesService.pushMenuToCategory(
      menuData.category,
      oldMenu._id,
    );
  }

  async deleteOneMenu(id: string) {
    const currentDate = new Date();
    const menu = await this.menuModel
      .findByIdAndUpdate(
        id,
        {
          deleted_at: currentDate,
        },
        { new: true },
      )
      .exec();
    if (<Types.ObjectId>menu.category) {
      await this.categoriesService.pullMenuFromCategory(
        menu.category._id,
        menu._id,
      );
    }
  }

  async deleteManyMenus(ids: Types.ObjectId[]) {
    const currentDate = new Date();
    const menus = await this.menuModel.find({ _id: { $in: ids } }).exec();
    const categories = menus.map((menu) => menu.category._id);

    await this.menuModel
      .updateMany({ _id: { $in: ids } }, { deleted_at: currentDate })
      .exec();

    if (categories.length > 0) {
      await this.categoriesService.pullManyMenusFromCategories(categories, ids);
    }
  }

  async publishMenu(id: string) {
    const currentDate = new Date();
    await this.menuModel
      .updateOne({ _id: id }, { published_at: currentDate })
      .exec();
  }

  async unpublishMenu(id: string) {
    await this.menuModel.updateOne({ _id: id }, { published_at: null }).exec();
  }
}
