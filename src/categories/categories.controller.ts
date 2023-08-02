import { CategorySchema } from '@/schema/categories.schema';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { MongooseError } from 'mongoose';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/category.dto';

@Controller('categories')
@ApiTags('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @HttpCode(HttpStatus.CREATED)
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Created new category',
    type: () => CreateCategoryDto,
  })
  @Post()
  createCategory(@Body() doc: CreateCategoryDto) {
    return this.categoriesService.createCategory(doc.title, doc.rank);
  }

  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Get all categories',
    type: () => CategorySchema,
    isArray: true,
  })
  @Get()
  getAllCategories() {
    return this.categoriesService.getAllCategories();
  }

  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Get categoriey by ID',
    type: () => CategorySchema,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Category not found',
  })
  @Get(':id')
  getCategory(@Param('id') id: string) {
    const doc = this.categoriesService.getCategoryById(id);
    if (!doc) {
      throw new HttpException('No category found', HttpStatus.NOT_FOUND);
    }
    return doc;
  }

  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Update category',
    type: () => CreateCategoryDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Category not found',
  })
  @Put(':id')
  async updateCategory(
    @Param('id') id: string,
    @Body() doc: CreateCategoryDto,
  ) {
    try {
      await this.categoriesService.updateCategory(id, doc);
    } catch (e) {
      if (e instanceof MongooseError) {
        throw new HttpException('Category not found', HttpStatus.NOT_FOUND);
      } else {
        throw e;
      }
    }
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Delete category',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Category not found',
  })
  @Delete(':id')
  async deleteCategory(@Param('id') id: string) {
    try {
      await this.categoriesService.deleteCategory(id);
    } catch (e) {
      if (e instanceof MongooseError) {
        throw new HttpException('Category not found', HttpStatus.NOT_FOUND);
      } else {
        throw e;
      }
    }
  }
}
