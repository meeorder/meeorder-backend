import { CategorySchema } from '@/schema/categories.schema';
import { Injectable } from '@nestjs/common';
import { ReturnModelType } from '@typegoose/typegoose';
import { Types } from 'mongoose';
import { InjectModel } from 'nest-typegoose';
import { CategoryDto } from './dto/category.dto';
@Injectable()
export class CategoriesService {
  constructor(
    @InjectModel(CategorySchema)
    private readonly categoryModel: ReturnModelType<typeof CategorySchema>,
  ) {}

  async createCategory(title: string, description: string) {
    return await this.categoryModel.create({
      title,
      description,
    });
  }

  async getAllCategories() {
    const doc = await this.categoryModel.find().exec();
    return doc;
  }

  async getCategoryById(id: string) {
    const doc = await this.categoryModel
      .findById(new Types.ObjectId(id))
      .exec();
    return doc;
  }

  async updateCategory(id: string, updatecategory: CategoryDto) {
    const doc = await this.categoryModel
      .findByIdAndUpdate(new Types.ObjectId(id), updatecategory, { new: true })
      .exec();
    return doc;
  }

  async deleteCategory(id: string): Promise<any> {
    const res = await this.categoryModel.deleteOne({ _id: id });
    return res;
  }
}
