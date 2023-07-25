import { SessionsService } from '@/sessions/sessions.service';
import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
} from '@nestjs/common';
import { ApiParam, ApiTags } from '@nestjs/swagger';
import { Types } from 'mongoose';

@Controller('sessions')
@ApiTags('sessions')
export class SessionsController {
  constructor(private sessionsService: SessionsService) {}
  @Get('/:id/orders')
  @ApiParam({ name: 'id', type: Types.ObjectId })
  async findOrderBySession(@Param('id') id) {
    if (!Types.ObjectId.isValid(id)) {
      throw new HttpException('Invalid id', HttpStatus.BAD_REQUEST);
    }
    return this.sessionsService.listOrderBySession(id);
  }
}
