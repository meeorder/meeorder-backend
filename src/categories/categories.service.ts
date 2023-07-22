import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { CategoryClass } from "src/schema/categories.schema";
import { Model } from "mongoose";

@Injectable()
export class CategoriesService{
    constructor(
        @InjectModel(CategoryClass.name)
    private readonly categoryModel: Model<CategoryClass>,
    ){}

    async createCategory(title: string, description:string ){
        return await this.categoryModel.create({
            title,
            description
        })
    }
}