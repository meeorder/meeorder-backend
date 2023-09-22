import { RankDto } from '@/categories/dto/category.rank.dto';
import { UpdateCategoryDto } from '@/categories/dto/category.updateCategory.dto';
import { CategorySchema } from '@/schema/categories.schema';
import { MenuSchema } from '@/schema/menus.schema';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ReturnModelType } from '@typegoose/typegoose';
import { Types, mongo } from 'mongoose';
import { InjectModel } from 'nest-typegoose';
@Injectable()
export class CategoriesService {
  constructor(
    @InjectModel(CategorySchema)
    private readonly categoryModel: ReturnModelType<typeof CategorySchema>,
    @InjectModel(MenuSchema)
    private readonly menuModel: ReturnModelType<typeof MenuSchema>,
  ) {}

  public readonly othersCategoryID = new Types.ObjectId(
    '64ef35bbe6c66d526b0981f0',
  );

  async createCategory(title: string) {
    return await this.categoryModel.create({
      title,
    });
  }

  async createOtherCategory() {
    const otherCategory = await this.categoryModel
      .findById(this.othersCategoryID)
      .exec();

    if (!otherCategory) {
      this.categoryModel.create({
        title: 'Others',
        _id: this.othersCategoryID,
      });
    }
    return otherCategory;
  }

  async getAllCategories() {
    const doc = await this.categoryModel
      .find()
      .sort([['rank', 'asc']])
      .exec();
    return doc;
  }

  async getCategoryById(id: string) {
    const doc = await this.categoryModel
      .findById(new Types.ObjectId(id))
      .exec();
    if (!doc) {
      throw new HttpException("Category doesn't exist", HttpStatus.NOT_FOUND)
    }
    return doc;
  }

  async updateCategory(id: string, updateCategory: UpdateCategoryDto) {
    const doc = await this.categoryModel
      .findByIdAndUpdate(new Types.ObjectId(id), updateCategory, { new: true })
      .exec();
    return doc;
  }

  async deleteCategory(id: string): Promise<mongo.DeleteResult> {
    let menuData = await this.categoryModel.aggregate([
      { $match: { _id: new Types.ObjectId(id) } },
      { $unwind: '$menus' },
      { $project: { _id: 0, menus: 1 } },
    ]);
    menuData = menuData.map((menu) => menu.menus);

    await this.pushManyMenusToCategory(this.othersCategoryID, menuData);

    await this.menuModel.updateMany(
      { _id: { $in: menuData } },
      { category: this.othersCategoryID },
    );

    return await this.categoryModel.deleteOne({ _id: id }).exec();
  }

  async updateRank(rankBody: RankDto) {
    const doc = rankBody;
    const updates = doc.rank.map((id, index) => ({
      updateOne: {
        filter: { _id: new Types.ObjectId(id) },
        update: { $set: { rank: index } },
      },
    }));
    await this.categoryModel.bulkWrite(updates);
  }

  async pushManyMenusToCategory(categoryID: Types.ObjectId, menuId: Types.ObjectId[]) {
    const doc = await this.categoryModel
      .findByIdAndUpdate(
        categoryID,
        { $push: { menus: { $each: menuId } } },
        { new: true },
      )
      .exec();
    return doc;
  }

  async pushMenuToCategory(categoryId: Types.ObjectId, menuId: Types.ObjectId) {
    const doc = await this.categoryModel
      .findByIdAndUpdate(
        categoryId,
        { $push: { menus: menuId } },
        { new: true },
      )
      .exec();
    return doc;
  }

  async popMenuFromCategory(
    categoryId: Types.ObjectId,
    menuId: Types.ObjectId,
  ) {
    const doc = await this.categoryModel
      .findByIdAndUpdate(
        categoryId,
        { $pull: { menus: menuId } },
        { new: true },
      )
      .exec();
    return doc;
  }

  async popManyMenusFromCategories(
    categoryIds: Types.ObjectId[],
    menuIds: Types.ObjectId[],
  ) {
    await this.categoryModel
      .updateMany(
        { _id: { $in: categoryIds } },
        { $pull: { menus: { $in: menuIds } } },
      )
      .exec();
  }
}
