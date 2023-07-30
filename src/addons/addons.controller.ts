import { CreateAddonDto } from '@/addons/dto/addon.dto';
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
import { AddonsService } from './addons.service';

@Controller('addons')
@ApiTags('addons')
export class AddonsController {
  constructor(private readonly addonService: AddonsService) {}

  @HttpCode(HttpStatus.CREATED)
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Create addon',
  })
  @Post()
  createAddon(@Body() doc: CreateAddonDto) {
    return this.addonService.createAddon(doc.title, doc.price);
  }

  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Get all addons',
  })
  @Get()
  getAllAddons() {
    return this.addonService.getAllAddons();
  }

  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Get addon by Id',
  })
  @Get(':id')
  getAddon(@Param('id') id: string) {
    return this.addonService.getAddonById(id);
  }

  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Update addon',
  })
  @Put(':id')
  updateAddon(@Param('id') id: string, @Body() doc: CreateAddonDto) {
    return this.addonService.updateAddon(id, doc);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Delete addon',
  })
  @Delete(':id')
  async deleteAddon(@Param('id') id: string) {
    await this.addonService.deleteAddon(id);
  }
}
