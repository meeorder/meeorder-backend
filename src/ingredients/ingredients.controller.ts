import { CreateIngredientDto } from '@/ingredients/dto/create.ingredient.dto';
import { UpdateIngredientDto } from '@/ingredients/dto/update.ingredient.dto';
import { IngredientsService } from '@/ingredients/ingredients.service';
import { IngredientSchema } from '@/schema/ingredients.schema';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Put,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@Controller({ path: 'ingredients', version: '1' })
@ApiTags('ingredients')
export class IngredientsController {
  constructor(private readonly ingredientsService: IngredientsService) {}

  // Create a ingredient
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Ingredient created',
    type: () => IngredientSchema,
  })
  @ApiOperation({
    summary: 'Create a ingredient',
  })
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createIngredientDto: CreateIngredientDto) {
    return await this.ingredientsService.createIngredient(createIngredientDto);
  }

  // Get all ingredients
  @ApiResponse({
    status: HttpStatus.OK,
    type: () => IngredientSchema,
    isArray: true,
  })
  @ApiOperation({
    summary: 'Get all ingredients',
  })
  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll() {
    return await this.ingredientsService.getAllIngredient();
  }

  // Get a ingredient by id
  @ApiResponse({
    status: HttpStatus.OK,
    type: () => IngredientSchema,
  })
  @ApiOperation({
    summary: 'Get a ingredient by id',
  })
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findOne(@Param('id') id: string) {
    return await this.ingredientsService.getIngredientById(id);
  }

  // Update a ingredient
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Ingredient updated',
    type: () => IngredientSchema,
  })
  @ApiOperation({
    summary: 'Update a ingredient by id',
  })
  @Put(':id')
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('id') id: string,
    @Body() updateIngredientDto: UpdateIngredientDto,
  ) {
    return await this.ingredientsService.updateIngredient(
      id,
      updateIngredientDto,
    );
  }

  // Delete a ingredient
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Ingredient deleted',
  })
  @ApiOperation({
    summary: 'Delete a ingredient by id',
  })
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async remove(@Param('id') id: string) {
    return await this.ingredientsService.deleteIngredient(id);
  }

  // Update status of a ingredient(unavailable)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Ingredient unavailable status updated',
  })
  @ApiOperation({
    summary: 'Update status of a ingredient to unavailable by id',
  })
  @Patch(':id/unavailable')
  @HttpCode(HttpStatus.OK)
  async updateIngredientToUnavailable(@Param('id') id: string) {
    return await this.ingredientsService.updateIngredientToUnavailable(id);
  }

  // Update status of a ingredient(available)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Ingredient available status updated',
  })
  @ApiOperation({
    summary: 'Update status of a ingredient to available by id',
  })
  @Patch(':id/available')
  @HttpCode(HttpStatus.OK)
  async updateIngredientToAvailable(@Param('id') id: string) {
    return await this.ingredientsService.updateIngredientToAvailable(id);
  }
}
