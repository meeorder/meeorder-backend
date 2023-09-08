import { RankDto } from '@/categories/dto/category.rank.dto';
import { UpdateCategoryDto } from '@/categories/dto/category.updateCategory.dto';
import { CategorySchema } from '@/schema/categories.schema';
import { Injectable } from '@nestjs/common';
import { ReturnModelType } from '@typegoose/typegoose';
import { Types, mongo } from 'mongoose';
import { InjectModel } from 'nest-typegoose';
@Injectable()
export class CategoriesService {
  constructor(
    @InjectModel(CategorySchema)
    private readonly categoryModel: ReturnModelType<typeof CategorySchema>,
  ) {}

  async createCategory(title: string) {
    return await this.categoryModel.create({
      title,
    });
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
    return doc;
  }

  async updateCategory(id: string, updateCategory: UpdateCategoryDto) {
    const doc = await this.categoryModel
      .findByIdAndUpdate(new Types.ObjectId(id), updateCategory, { new: true })
      .exec();
    return doc;
  }

  async deleteCategory(id: string): Promise<mongo.DeleteResult> {
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

  async pullMenuFromCategory(
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

  async pullManyMenusFromCategories(
    categoryIds: Types.ObjectId[],
    menuIds: Types.ObjectId[],
  ) {
    await this.categoryModel.updateMany(
      { _id: { $in: categoryIds } },
      { $pull: { menus: { $in: menuIds } } },
    );
  }
}
