import { Body, Controller, Post } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { CategoriesService } from "./categories.service";
import { CreateCategoryDto } from "./dto/create-category.dto";

@Controller('categories')
@ApiTags('categories')
export class CategoriesController{
    constructor(private readonly categoriesService: CategoriesService){}

    @Post()
    createCategory(@Body() doc: CreateCategoryDto){
        return this.categoriesService.createCategory(doc.title,doc.description)
    }
}