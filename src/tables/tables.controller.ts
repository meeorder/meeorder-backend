import { TablesDto } from '@/tables/dto/tables.dto';
import { TablesService } from '@/tables/tables.service';
import { Body, Controller, Get, HttpStatus, Post } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

@Controller('tables')
@ApiTags('tables')
export class TablesController {
  constructor(private readonly tablesService: TablesService) {}

  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Create table',
  })
  @Post()
  createTable(@Body() tables: TablesDto) {
    return this.tablesService.createTable(tables._id);
  }

  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Get tables',
  })
  @Get()
  getTables() {
    return this.tablesService.getTables();
  }
}
