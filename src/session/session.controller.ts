import { ParseMongoIdPipe } from '@/pipes/mongo-id.pipe';
import { SessionSchema } from '@/schema/session.schema';
import { CreateSessionDto } from '@/session/dto/create-session.dto';
import { OrdersListDto } from '@/session/dto/listorders.dto';
import { SessionService } from '@/session/session.service';
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
  Query,
} from '@nestjs/common';
import {
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { MongooseError, Types } from 'mongoose';

@Controller({ path: 'sessions', version: '1' })
@ApiTags('sessions')
export class SessionController {
  constructor(private readonly sessionService: SessionService) {}

  @ApiQuery({ name: 'finished', type: Boolean, required: false })
  @ApiResponse({
    status: HttpStatus.OK,
    type: () => SessionSchema,
    isArray: true,
  })
  @ApiOperation({
    summary: 'Get all sessions',
  })
  @Get()
  getSessions(@Query('finished') finished?: boolean) {
    return this.sessionService.getSessions(finished);
  }

  @ApiParam({ name: 'id', type: String, description: 'Session ID (ObjectID)' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Session',
    type: () => SessionSchema,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Session not found',
  })
  @ApiOperation({
    summary: 'Get a session by id',
  })
  @Get(':id')
  async getSession(@Param('id', new ParseMongoIdPipe()) id: Types.ObjectId) {
    const doc = await this.sessionService.getSessionById(id);
    if (!doc) {
      throw new HttpException(`Session ${id} not found`, HttpStatus.NOT_FOUND);
    }
    return doc;
  }

  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Session',
    type: () => SessionSchema,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'No session found in the table',
  })
  @ApiOperation({
    summary: 'Get a session by table id',
  })
  @ApiParam({ name: 'id', type: Number, description: 'Table ID' })
  @Get('table/:id')
  async getSessionByTable(@Param('id') id: number) {
    const doc = await this.sessionService.getSessionByTable(id);
    if (!doc) {
      throw new HttpException(
        `No session found in the table ${id}`,
        HttpStatus.NOT_FOUND,
      );
    }

    return doc;
  }

  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Session created',
    type: () => SessionSchema,
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'Session already exists',
  })
  @ApiOperation({
    summary: 'Create a session',
  })
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createSession(@Body() dto: CreateSessionDto) {
    await this.sessionService.validateTableHasSession(dto.table);
    const doc = await this.sessionService.createSession(dto.table, dto.uid);
    return doc;
  }

  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Session finished',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Session not found',
  })
  @ApiParam({ name: 'id', type: String, description: 'Session ID (ObjectId)' })
  @ApiOperation({
    summary: 'Finish a session',
  })
  @Patch(':id/finish')
  @HttpCode(HttpStatus.NO_CONTENT)
  async finishSession(@Param('id', new ParseMongoIdPipe()) id: Types.ObjectId) {
    try {
      await this.sessionService.finishSession(id);
    } catch (e) {
      if (e instanceof MongooseError) {
        throw new HttpException('Session not found', HttpStatus.NOT_FOUND);
      } else {
        throw e;
      }
    }
  }

  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Session deleted',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Session not found',
  })
  @ApiParam({ name: 'id', type: String, description: 'Session ID (ObjectId)' })
  @ApiOperation({
    summary: 'Delete a session by id',
  })
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteSession(@Param('id', new ParseMongoIdPipe()) id: Types.ObjectId) {
    try {
      await this.sessionService.deleteSession(id);
    } catch (e) {
      if (e instanceof MongooseError) {
        throw new HttpException('Session not found', HttpStatus.NOT_FOUND);
      } else {
        throw e;
      }
    }
  }

  @Get('/:id/orders')
  @ApiParam({ name: 'id', type: String, description: 'Session ID (ObjectId)' })
  @ApiResponse({
    type: () => OrdersListDto,
    status: HttpStatus.OK,
  })
  @ApiOperation({
    summary: 'Get orders by session',
  })
  @HttpCode(HttpStatus.OK)
  async getOrdersBySession(
    @Param('id', new ParseMongoIdPipe()) id: Types.ObjectId,
  ) {
    return await this.sessionService.listOrdersBySession(id);
  }
}
