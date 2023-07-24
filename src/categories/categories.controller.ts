import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { CategoriesService } from './categories.service';
import { CategoryDto } from './dto/category.dto';

@Controller('categories')
@ApiTags('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Created new category',
  })
  @Post()
  createCategory(@Body() doc: CategoryDto) {
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

  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Get all categories',
  })
  @Get(':id')
  getCategory(@Param('id') id: string) {
    return this.categoriesService.getCategoryById(id);
  }

  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Update category',
  })
  @Put(':id')
  updateCategory(@Param('id') id: string, @Body() doc: CategoryDto) {
    return this.categoriesService.updateCategory(id, doc);
  }

  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Delete category',
  })
  @Delete(':id')
  deleteCategory(@Param('id') id: string) {
    return this.categoriesService.deleteCategory(id);
  }
}
