import { RankDto } from '@/categories/dto/category.rank.dto';
import { UpdateCategoryDto } from '@/categories/dto/category.updateCategory.dto';
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
  Patch,
  Post,
  Put,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { MongooseError } from 'mongoose';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/category.createCategory.dto';

@Controller({ path: 'categories', version: '1' })
@ApiTags('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @HttpCode(HttpStatus.CREATED)
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Created new category',
    type: () => CreateCategoryDto,
  })
  @ApiOperation({
    summary: 'Create a category',
  })
  @Post()
  createCategory(@Body() doc: CreateCategoryDto) {
    return this.categoriesService.createCategory(doc.title);
  }

  @ApiResponse({
    status: HttpStatus.OK,
    type: () => CategorySchema,
    isArray: true,
  })
  @ApiOperation({
    summary: 'Get all categories',
  })
  @Get()
  getAllCategories() {
    return this.categoriesService.getAllCategories();
  }

  @ApiResponse({
    status: HttpStatus.OK,
    type: () => CategorySchema,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Category not found',
  })
  @ApiOperation({
    summary: 'Get a category by id',
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
    type: () => UpdateCategoryDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Category not found',
  })
  @ApiOperation({
    summary: 'Replace a category by id',
  })
  @Put(':id')
  async updateCategory(
    @Param('id') id: string,
    @Body() doc: UpdateCategoryDto,
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
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Category not found',
  })
  @ApiOperation({
    summary: 'Delete a category by id',
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

  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Change category rank',
  })
  @ApiOperation({
    summary: "order the categories' rank",
  })
  @Patch('rank')
  async updateRank(@Body() doc: RankDto) {
    await this.categoriesService.updateRank(doc);
  }
}
