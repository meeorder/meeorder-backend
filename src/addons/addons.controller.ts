import { CreateAddonDto } from '@/addons/dto/addon.dto';
import { AddonSchema } from '@/schema/addons.schema';
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
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { MongooseError } from 'mongoose';
import { AddonsService } from './addons.service';

@Controller({ path: 'addons', version: '1' })
@ApiTags('addons')
export class AddonsController {
  constructor(private readonly addonService: AddonsService) {}

  @HttpCode(HttpStatus.CREATED)
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Created addon',
    type: () => CreateAddonDto,
  })
  @ApiOperation({ summary: 'Create a addon' })
  @Post()
  createAddon(@Body() doc: CreateAddonDto) {
    return this.addonService.createAddon(doc.title, doc.price);
  }

  @ApiResponse({
    status: HttpStatus.OK,
    type: () => AddonSchema,
    isArray: true,
  })
  @Get()
  @ApiOperation({ summary: 'Get all addons' })
  getAllAddons() {
    return this.addonService.getAllAddons();
  }

  @ApiResponse({
    status: HttpStatus.OK,
    type: () => AddonSchema,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Addon not found',
  })
  @ApiOperation({
    summary: 'Get a addon by id',
  })
  @Get(':id')
  getAddon(@Param('id') id: string) {
    const doc = this.addonService.getAddonById(id);
    if (!doc) {
      throw new HttpException('No addon found', HttpStatus.NOT_FOUND);
    }
    return doc;
  }

  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Updated addon',
    type: () => CreateAddonDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Addon not found',
  })
  @ApiOperation({
    summary: 'Replace a addon by id',
  })
  @Put(':id')
  async updateAddon(@Param('id') id: string, @Body() doc: CreateAddonDto) {
    try {
      await this.addonService.updateAddon(id, doc);
    } catch (e) {
      if (e instanceof MongooseError) {
        throw new HttpException('Addon not found', HttpStatus.NOT_FOUND);
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
    description: 'Addon not found',
  })
  @ApiOperation({
    summary: 'Delete a addon by id',
  })
  @Delete(':id')
  async deleteAddon(@Param('id') id: string) {
    try {
      await this.addonService.deleteAddon(id);
    } catch (e) {
      if (e instanceof MongooseError) {
        throw new HttpException('Addon not found', HttpStatus.NOT_FOUND);
      } else {
        throw e;
      }
    }
  }
}
