import { Role } from '@/decorator/roles.decorator';
import { CreateMenuDto } from '@/menus/dto/menus.createMenu.dto';
import { GetAllMenuResponseDto } from '@/menus/dto/menus.getAllMenuResponse.dto';
import { GetMenuByIdResponseDto } from '@/menus/dto/menus.getMenuByIdReponse.dto';
import { ParseStringObjectIdArrayPipe } from '@/menus/menus.pipe';
import { MenuSchema } from '@/schema/menus.schema';
import { UserRole } from '@/schema/users.schema';
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
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Types } from 'mongoose';
import { MenusService } from './menus.service';
@Controller({ path: 'menus', version: '1' })
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
    type: () => GetMenuByIdResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'No menu found',
  })
  @ApiOperation({
    summary: 'Get a menu by id',
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
  @ApiOperation({
    summary: 'Create a menu',
  })
  @ApiBearerAuth()
  @Role(UserRole.Owner)
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
  @ApiOperation({
    summary: 'Replace a menu by id',
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
  @ApiOperation({
    summary: 'Delete a menu by id',
  })
  @ApiBearerAuth()
  @Role(UserRole.Owner)
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
  @ApiOperation({
    summary: 'Delete menus by ids',
    description: 'Delete many menus',
  })
  @ApiBearerAuth()
  @Role(UserRole.Owner)
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
  @ApiOperation({
    summary: 'Publish a menu by id',
  })
  @ApiBearerAuth()
  @Role(UserRole.Owner)
  @Patch(':id/publish')
  async publishMenuById(@Param('id') id: string) {
    await this.menuservice.publishMenu(id);
  }

  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The menu has been successfully unpublished.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'No menu found',
  })
  @ApiOperation({
    summary: 'Unpublish a menu by id',
  })
  @ApiBearerAuth()
  @Role(UserRole.Owner)
  @Patch(':id/unpublish')
  async unpublishMenuById(@Param('id') id: string) {
    await this.menuservice.unpublishMenu(id);
  }
}
