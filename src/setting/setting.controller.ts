import { Role } from '@/decorator/roles.decorator';
import { SettingSchema } from '@/schema/setting.schema';
import { UserRole } from '@/schema/users.schema';
import { SettingDto } from '@/setting/dto/setting.dto';
import { SettingService } from '@/setting/setting.service';
import { Body, Controller, Get, HttpStatus, Patch, Post } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@Controller({ path: 'settings', version: '1' })
@ApiTags('settings')
@ApiBearerAuth()
export class SettingController {
  constructor(private readonly settingService: SettingService) {}

  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Get Restaurant Settings',
    type: () => SettingSchema,
  })
  @ApiOperation({
    summary: 'Get Restaurant Settings',
  })
  @Role(UserRole.Owner)
  @Get()
  async getSettings() {
    return await this.settingService.getSettings();
  }

  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Create Empty Restaurant Settings',
    type: () => SettingSchema,
  })
  @ApiOperation({
    summary: 'Create Empty Restaurant Settings',
  })
  @Role(UserRole.Owner)
  @Post()
  async createSettings() {
    return await this.settingService.createSettings(null, null);
  }

  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Update Restaurant Settings',
    type: () => SettingSchema,
  })
  @ApiOperation({
    summary: 'Update Restaurant Settings',
  })
  @Role(UserRole.Owner)
  @Patch()
  async updateSettings(@Body() settingDto: SettingDto) {
    return await this.settingService.updateSettings(settingDto);
  }
}
