import { CreateMenuDto } from '@/menus/dto/menus.createMenu.dto';
import { GetAllMenuResponseDto } from '@/menus/dto/menus.getAllMenuResponse.dto';
import { GetMenuByIdResponseDto } from '@/menus/dto/menus.getMenuByIdReponse.dto';
import { ParseStringObjectIdArrayPipe } from '@/menus/menus.pipe';
import { MenuSchema } from '@/schema/menus.schema';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Patch,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Types } from 'mongoose';
import { MenusService } from './menus.service';
@Controller('menus')
@ApiTags('menus')
export class MenusController {
  constructor(private readonly menuservice: MenusService) {}

  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Get all menus',
    type: () => GetAllMenuResponseDto,
    isArray: true,
  })
  @ApiQuery({ name: 'status', enum: ['published', 'draft', 'all'] })
  @Get()
  async getMenus(
    @Query('status') status: string = 'published',
  ): Promise<GetAllMenuResponseDto[]> {
    return await this.menuservice.findAllMenus(status);
  }

  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Get menu by id',
    type: () => GetMenuByIdResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'No menu found',
  })
  @Get(':id')
  async getMenuById(@Param('id') id: string): Promise<GetMenuByIdResponseDto> {
    const result = await this.menuservice.findOneMenu(id);
    if (!result) {
      throw new HttpException('No menu found', HttpStatus.NOT_FOUND);
    }
    return result;
  }

  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'The menu has been successfully created.',
    type: () => MenuSchema,
  })
  @Post()
  async createMenu(@Body() foodData: CreateMenuDto): Promise<MenuSchema> {
    const createdMenu = await this.menuservice.createMenu(foodData);
    return createdMenu;
  }

  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The menu has been successfully updated.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'No menu found',
  })
  @Put(':id')
  async updateMenuById(
    @Param('id') id: string,
    @Body() foodData: CreateMenuDto,
  ) {
    await this.menuservice.updateOne(id, foodData);
  }

  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The menu has been successfully deleted.',
  })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'No menu found',
  })
  @Delete(':id')
  async removeMenuById(@Param('id') id: string) {
    await this.menuservice.deleteOneMenu(id);
  }

  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The menus have been successfully deleted.',
  })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'No menu found',
  })
  @Delete()
  async removeMenus(
    @Query('ids', new ParseStringObjectIdArrayPipe()) ids: Types.ObjectId[],
  ) {
    await this.menuservice.deleteManyMenus(ids);
  }

  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The menu has been successfully published.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'No menu found',
  })
  @Patch(':id/publish')
  async publishMenuById(@Param('id') id: string) {
    await this.menuservice.publishMenu(id);
  }
}
