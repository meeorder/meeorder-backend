import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
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

  @HttpCode(HttpStatus.CREATED)
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

  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Delete category',
  })
  @Delete(':id')
  deleteCategory(@Param('id') id: string) {
    this.categoriesService.deleteCategory(id);
  }
}
