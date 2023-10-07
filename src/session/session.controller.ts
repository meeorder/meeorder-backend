import { UserJwt } from '@/auth/user.jwt.payload';
import { Role } from '@/decorator/roles.decorator';
import { User } from '@/decorator/user.decorator';
import { ParseMongoIdPipe } from '@/pipes/mongo-id.pipe';
import { ReceiptService } from '@/receipt/receipt.service';
import { ReceiptSchema } from '@/schema/receipt.schema';
import { SessionSchema } from '@/schema/session.schema';
import { UserRole } from '@/schema/users.schema';
import { CreateSessionDto } from '@/session/dto/create-session.dto';
import { GetSessionDto } from '@/session/dto/get-session.dto';
import { OrdersListDto } from '@/session/dto/listorders.dto';
import { UpdateSessionCouponDto } from '@/session/dto/updatecoupon.dto';
import { SessionService } from '@/session/session.service';
import {
  Body,
  ConflictException,
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
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { MongooseError, Types } from 'mongoose';
import { CouponDto } from './dto/getcoupon.dto';

@Controller({ path: 'sessions', version: '1' })
@ApiTags('sessions')
export class SessionController {
  constructor(
    private readonly sessionService: SessionService,
    private readonly receiptService: ReceiptService,
  ) {}

  @ApiQuery({ name: 'finished', type: Boolean, required: false })
  @ApiResponse({
    status: HttpStatus.OK,
    type: () => GetSessionDto,
    isArray: true,
  })
  @ApiOperation({
    summary: 'Get all sessions',
  })
  @ApiBearerAuth()
  @Role(UserRole.Employee)
  @Get()
  getSessions(@Query('finished') finished?: boolean) {
    return this.sessionService.getSessions(finished);
  }

  @ApiParam({ name: 'id', type: String, description: 'Session ID (ObjectID)' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Session',
    type: () => GetSessionDto,
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
    type: () => GetSessionDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'No session found in the table',
  })
  @ApiOperation({
    summary: 'Get a session by table id',
  })
  @ApiParam({ name: 'id', type: String, description: 'Table ID' })
  @Get('table/:id')
  async getSessionByTable(
    @Param('id', new ParseMongoIdPipe()) id: Types.ObjectId,
  ) {
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
  @ApiBearerAuth()
  @Role(UserRole.Employee)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createSession(@Body() dto: CreateSessionDto) {
    await this.sessionService.validateTableHasSession(dto.table);
    const doc = await this.sessionService.createSession(dto.table);
    return doc;
  }

  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Receipt of session',
    type: () => ReceiptSchema,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Session not found',
  })
  @ApiParam({ name: 'id', type: String, description: 'Session ID (ObjectId)' })
  @ApiOperation({
    summary: 'Finish a session',
  })
  @ApiBearerAuth()
  @Role(UserRole.Employee)
  @Patch(':id/finish')
  @HttpCode(HttpStatus.OK)
  async finishSession(@Param('id', new ParseMongoIdPipe()) id: Types.ObjectId) {
    const session = await this.sessionService.finishSession(id);
    const receipt = await this.receiptService.generateReceipt(session);

    return receipt.toObject({ virtuals: true });
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
  @ApiBearerAuth()
  @Role(UserRole.Employee)
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

  @ApiOkResponse({
    description: 'Updated session user',
  })
  @ApiOperation({
    summary: 'Updated session user',
    description: 'user in header will be used as session user',
  })
  @HttpCode(HttpStatus.OK)
  @ApiParam({ name: 'id', type: String, description: 'Session ID (ObjectId)' })
  @Patch(':id/user')
  @ApiBearerAuth()
  @Role(UserRole.Customer)
  async updateSessionUser(
    @Param('id', new ParseMongoIdPipe()) id: Types.ObjectId,
    @User() user: UserJwt,
  ) {
    await this.sessionService.updateSessionUser(id, user);
  }

  @ApiResponse({
    status: HttpStatus.OK,
    type: () => CouponDto,
    isArray: true,
    description: 'Get all redeemable coupon',
  })
  @ApiOperation({
    summary: 'Get all redeemable coupon',
  })
  @HttpCode(HttpStatus.OK)
  @ApiParam({ name: 'id', type: String, description: 'Session ID (ObjectId)' })
  @ApiBearerAuth()
  @Get(':id/coupon/all')
  async getCoupons(
    @Param('id', new ParseMongoIdPipe()) id: Types.ObjectId,
    @User() user?: UserJwt,
  ) {
    return await this.sessionService.getAllCoupon(
      id,
      user?.id ? new Types.ObjectId(user?.id) : null,
    );
  }

  @ApiResponse({
    description: 'Coupon is attached to session',
    status: HttpStatus.NO_CONTENT,
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'Resource conflict (coupon quota has been reached)',
  })
  @ApiOperation({
    summary: 'Update coupon in session',
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiParam({ name: 'id', type: String, description: 'Session ID (ObjectId)' })
  @Patch(':id/coupon')
  async updateSessionCoupon(
    @Param('id', new ParseMongoIdPipe()) id: Types.ObjectId,
    @Body() doc: UpdateSessionCouponDto,
  ) {
    try {
      await this.sessionService.updateSessionCoupon(id, doc);
    } catch (e) {
      if (e instanceof ConflictException) {
        throw new HttpException(e.message, HttpStatus.CONFLICT);
      } else {
        throw e;
      }
    }
  }
}
