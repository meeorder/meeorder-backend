import { Injectable, Param } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { CategoryClass } from "src/schema/categories.schema";
import { Model,Types } from "mongoose";
import { UpdateCategoryDto } from "./dto/update-category.dto";

@Injectable()
export class CategoriesService{
    constructor(
        @InjectModel(CategoryClass.name)
    private readonly categoryModel: Model<CategoryClass>,){}

    async createCategory(title: string, description:string ){
        return await this.categoryModel.create({
            title,
            description
        })
    }

    async getAllCategories(){
        const doc = await this.categoryModel.find().exec();
        return doc;
    }

    async getCategory(id:string){
        const doc = await this.categoryModel.findOne(new Types.ObjectId(id));
        return doc;
    }

    async updateCategory(id:string , updatecategory: UpdateCategoryDto){
        const doc = await this.categoryModel.findByIdAndUpdate(new Types.ObjectId(id),{
            description: UpdateCategoryDto
        })
        return doc;
    }

    
}