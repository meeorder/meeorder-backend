import { Role } from '@/decorator/roles.decorator';
import { ParseMongoIdPipe } from '@/pipes/mongo-id.pipe';
import { TablesSchema } from '@/schema/tables.schema';
import { UserRole } from '@/schema/users.schema';
import { TablesDto } from '@/tables/dto/tables.dto';
import { TablesService } from '@/tables/tables.service';
import { Body, Controller, Get, HttpStatus, Param, Post } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Types } from 'mongoose';

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
    description: 'Get tables',
    type: () => TablesSchema,
    isArray: true,
  })
  @ApiOperation({
    summary: 'Get all tables',
  })
  @Role(UserRole.Employee)
  @Get()
  getTables() {
    return this.tablesService.getTables();
  }

  @ApiOkResponse()
  @ApiOperation({
    summary: 'Get table by id',
  })
  @Role(UserRole.Employee)
  @Get(':id')
  getTableById(@Param('id', new ParseMongoIdPipe()) id: Types.ObjectId) {}
}
