import { Role } from '@/decorator/roles.decorator';
import { ParseMongoIdPipe } from '@/pipes/mongo-id.pipe';
import { TablesSchema } from '@/schema/tables.schema';
import { UserRole } from '@/schema/users.schema';
import { TableResponseDto } from '@/tables/dto/table.response.dto';
import { TableUpdateRequestDto } from '@/tables/dto/table.update.request.dto';
import { TablesDto } from '@/tables/dto/tables.dto';
import { TablesService } from '@/tables/tables.service';
import { ErrorDto } from '@/utils/errors/error.dto';
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
import {
  ApiBearerAuth,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Types } from 'mongoose';
import { TablesResponseDto } from './dto/tables.response.dto';

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
    type: () => TablesResponseDto,
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

  @ApiOkResponse({
    type: () => TableResponseDto,
  })
  @ApiOperation({
    summary: 'Get table by id',
  })
  @ApiParam({ name: 'id', type: String })
  @Role(UserRole.Employee)
  @Get(':id')
  getTableById(@Param('id', new ParseMongoIdPipe()) id: Types.ObjectId) {
    return this.tablesService.getTableById(id);
  }

  @ApiNoContentResponse()
  @ApiQuery({
    name: 'id',
    type: String,
    description: 'table id',
    required: true,
  })
  @ApiNotFoundResponse({
    type: () => ErrorDto,
  })
  @ApiOperation({
    summary: 'Soft delete table',
  })
  @Role(UserRole.Owner)
  @Delete()
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteTable(@Param('id', new ParseMongoIdPipe()) id: Types.ObjectId) {
    this.tablesService.deleteTable(id);
  }

  @ApiOkResponse({
    type: () => TablesSchema,
    description: 'updated table',
  })
  @ApiNotFoundResponse({
    type: () => ErrorDto,
  })
  @Role(UserRole.Owner)
  @Put()
  async updateTable(
    @Param('id', new ParseMongoIdPipe()) id: Types.ObjectId,
    @Body() body: TableUpdateRequestDto,
  ): Promise<TablesSchema> {
    const table = await this.tablesService.updateTable(id, body);
    return table.toObject();
  }
}
