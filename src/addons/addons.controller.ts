import { CreateAddonDto } from '@/addons/dto/addon.dto';
import { GetAddonDto } from '@/addons/dto/getaddon.dto';
import { UpdateAddonDto } from '@/addons/dto/update-addon.dto';
import { Role } from '@/decorator/roles.decorator';
import { ParseMongoIdPipe } from '@/pipes/mongo-id.pipe';
import { AddonSchema } from '@/schema/addons.schema';
import { UserRole } from '@/schema/users.schema';
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
  Query,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { MongooseError, Types } from 'mongoose';
import { AddonsService } from './addons.service';

@Controller({ path: 'addons', version: '1' })
@ApiTags('addons')
export class AddonsController {
  constructor(private readonly addonService: AddonsService) {}

  @HttpCode(HttpStatus.CREATED)
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Created addon',
    type: () => AddonSchema,
  })
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a addon' })
  @Post()
  @Role(UserRole.Owner)
  async createAddon(@Body() doc: CreateAddonDto) {
    return await this.addonService.createAddon(doc.title, doc.price);
  }

  @ApiResponse({
    status: HttpStatus.OK,
    type: () => GetAddonDto,
    isArray: true,
  })
  @Get()
  @ApiQuery({ name: 'status', enum: ['active', 'all'] })
  @ApiOperation({ summary: 'Get all addons' })
  async getAllAddons(@Query('status') status: string = 'active') {
    return await this.addonService.getAllAddons(status);
  }

  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    type: () => GetAddonDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Addon not found',
  })
  @ApiOperation({
    summary: 'Get a addon by id',
  })
  @ApiParam({ name: 'id', type: String, description: 'Addon ID (ObjectID)' })
  @Get(':id')
  async getAddon(@Param('id') id: string) {
    const doc = await this.addonService.getAddonById(id);
    if (!doc) {
      throw new HttpException('No addon found', HttpStatus.NOT_FOUND);
    }
    return doc;
  }

  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Updated addon',
    type: () => AddonSchema,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Addon not found',
  })
  @ApiOperation({
    summary: 'Replace a addon by id',
  })
  @ApiBearerAuth()
  @ApiParam({ name: 'id', type: String, description: 'Addon ID (ObjectID)' })
  @Put(':id')
  @Role(UserRole.Owner)
  async updateAddon(@Param('id') id: string, @Body() doc: UpdateAddonDto) {
    await this.addonService.updateAddon(id, doc);
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
  @ApiParam({ name: 'id', type: String, description: 'Addon ID (ObjectID)' })
  @Delete(':id')
  @ApiBearerAuth()
  @Role(UserRole.Owner)
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

  @Patch('/:id/activate')
  @ApiParam({ name: 'id', type: String, description: 'Addon ID (ObjectID)' })
  @ApiOperation({
    summary: 'Change addon status to available',
  })
  @ApiBearerAuth()
  @Role(UserRole.Owner)
  @HttpCode(HttpStatus.NO_CONTENT)
  async setAvailable(@Param('id', new ParseMongoIdPipe()) id: Types.ObjectId) {
    await this.addonService.setAvailable(id, true);
  }

  @Patch('/:id/deactivate')
  @ApiParam({ name: 'id', type: String, description: 'Addon ID (ObjectID)' })
  @ApiOperation({
    summary: 'Change addon status to unavailable',
  })
  @ApiBearerAuth()
  @Role(UserRole.Owner)
  @HttpCode(HttpStatus.NO_CONTENT)
  async setUnavailable(
    @Param('id', new ParseMongoIdPipe()) id: Types.ObjectId,
  ) {
    await this.addonService.setAvailable(id, false);
  }

  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'All addons is now available',
  })
  @ApiOperation({
    summary: 'Make all addons available',
  })
  @Post('/activate/all')
  @HttpCode(HttpStatus.NO_CONTENT)
  async activateAllAddon() {
    await this.addonService.activateAllAddon();
  }
}
