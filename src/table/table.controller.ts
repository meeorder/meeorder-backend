import { CreateTableDto } from '@/table/dto/create-table.dto';
import { TableService } from '@/table/table.service';
import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@Controller('tables')
@ApiTags('tables')
export class TableController {
  constructor(private readonly tableService: TableService) {}

  @Post()
  createTable(@Body() dto: CreateTableDto) {
    return this.tableService.createTable(dto.id);
  }

  @Get()
  getTables() {
    return this.tableService.getTables();
  }
}
