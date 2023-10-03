import { Role } from '@/decorator/roles.decorator';
import { TablesSchema } from '@/schema/tables.schema';
import { UserRole } from '@/schema/users.schema';
import { TablesDto } from '@/tables/dto/tables.dto';
import { TableResponseDto } from '@/tables/dto/tables.response.dto';
import { TablesService } from '@/tables/tables.service';
import { Body, Controller, Get, HttpStatus, Post } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@Controller({ path: 'tables', version: '1' })
@ApiTags('tables')
@ApiBearerAuth()
export class TablesController {
  constructor(private readonly tablesService: TablesService) {}

  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Create table',
    type: () => TablesSchema,
  })
  @ApiOperation({
    summary: 'Create a table',
  })
  @Role(UserRole.Owner)
  @Post()
  createTable(@Body() { title }: TablesDto) {
    return this.tablesService.createTable(title);
  }

  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Get all tables with information',
    type: () => TableResponseDto,
    isArray: true,
  })
  @ApiOperation({
    summary: 'Get all tables with information',
  })
  @Role(UserRole.Employee)
  @Get()
  getTables() {
    return this.tablesService.getTables();
  }
}
