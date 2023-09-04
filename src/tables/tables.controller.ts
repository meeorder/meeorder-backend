import { TablesSchema } from '@/schema/tables.schema';
import { TablesDto } from '@/tables/dto/tables.dto';
import { TablesService } from '@/tables/tables.service';
import { Body, Controller, Get, HttpStatus, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@Controller({ path: 'tables', version: '1' })
@ApiTags('tables')
export class TablesController {
  constructor(private readonly tablesService: TablesService) {}

  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Create table',
  })
  @ApiOperation({
    summary: 'Create a table',
  })
  @Post()
  createTable(@Body() { table_number }: TablesDto) {
    return this.tablesService.createTable(table_number);
  }

  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Get tables',
    type: () => TablesSchema,
    isArray: true,
  })
  @ApiOperation({
    summary: 'Get all tables',
  })
  @Get()
  getTables() {
    return this.tablesService.getTables();
  }
}
