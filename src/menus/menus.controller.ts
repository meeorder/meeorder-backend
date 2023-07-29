import { CreateMenuDto } from '@/menus/dto/menus.createMenu.dto';
import { DeleteMenusDto } from '@/menus/dto/menus.deleteMenus.dto';
import { GetAllMenuResponseDto } from '@/menus/dto/menus.getAllMenuResponse.dto';
import { GetMenuByIdResponseDto } from '@/menus/dto/menus.getMenuByIdReponse.dto';
import { MenuSchema } from '@/schema/menus.schema';
import { DeleteResponseDto } from '@/utils/dto/deleteResponse.dto';
import { UpdateResponseDto } from '@/utils/dto/updateResponse.dto';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
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
  @Get()
  async getMenus(): Promise<GetAllMenuResponseDto[]> {
    return await this.menuservice.findAllMenus();
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
    type: () => UpdateResponseDto,
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
    type: () => DeleteResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'No menu found',
  })
  @Delete(':id')
  async removeMenuById(@Param('id') id: string) {
    await this.menuservice.deleteOneMenu(id);
  }

  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The menus have been successfully deleted.',
    type: () => DeleteResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'No menu found',
  })
  @Delete()
  async removeMenus(@Body() deleteMenuIds: DeleteMenusDto) {
    await this.menuservice.deleteManyMenus(deleteMenuIds);
  }
}
