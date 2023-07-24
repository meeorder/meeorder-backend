import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CategoryClass } from 'src/schema/categories.schema';
import { Model, Types } from 'mongoose';
import { CategoryDto } from './dto/category.dto';
@Injectable()
export class CategoriesService {
  constructor(
    @InjectModel(CategoryClass.name)
    private readonly categoryModel: Model<CategoryClass>,
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
