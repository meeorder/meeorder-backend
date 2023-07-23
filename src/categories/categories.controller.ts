import { Body, Controller, Get, HttpStatus, Post } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';

@Controller('categories')
@ApiTags('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Create new category',
    type: () => CreateCategoryDto,
  })
  @Post()
  createCategory(@Body() doc: CreateCategoryDto) {
    return this.categoriesService.createCategory(doc.title, doc.description);
  }

  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Get all categories',
  })
  @Get()
  getAllCategories() {
    return this.categoriesService.getAllCategories();
  }
}
