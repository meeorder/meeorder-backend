import { RankDto } from '@/categories/dto/category.rank.dto';
import { CategorySchema } from '@/schema/categories.schema';
import { Injectable } from '@nestjs/common';
import { ReturnModelType } from '@typegoose/typegoose';
import { Types, mongo } from 'mongoose';
import { InjectModel } from 'nest-typegoose';
import { CreateCategoryDto } from './dto/category.createCategory.dto';

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

  async updateCategory(id: string, updateCategory: CreateCategoryDto) {
    const doc = await this.categoryModel
      .findByIdAndUpdate(new Types.ObjectId(id), updateCategory, { new: true })
      .exec();
    return doc;
  }

  deleteCategory(id: string): Promise<mongo.DeleteResult> {
    return this.categoryModel.deleteOne({ _id: id }).exec();
  }

  async updateRank(rankBody: RankDto) {
    const doc = rankBody;
    const updates = [];
    doc.rank.forEach((id, index) => {
      updates.push({
        updateOne: {
          filter: { _id: new Types.ObjectId(id) },
          update: { $set: { rank: index } },
        },
      });
    });
    await this.categoryModel.bulkWrite(updates);
  }
}
