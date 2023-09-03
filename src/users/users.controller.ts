import { ParseMongoIdPipe } from '@/pipes/mongo-id.pipe';
import { UserSchema } from '@/schema/users.schema';
import { CreateUserDto } from '@/users/dto/user.create.dto';
import { UsersService } from '@/users/users.service';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Query,
} from '@nestjs/common';
import {
  ApiBody,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Types } from 'mongoose';

@Controller({ path: 'users', version: '1' })
@ApiTags('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post()
  @ApiBody({ type: CreateUserDto })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'Create user' })
  @ApiOperation({
    summary: 'Create user (for Owner)',
  })
  @HttpCode(HttpStatus.CREATED)
  async createUser(@Body() createUserDto: CreateUserDto) {
    return await this.usersService.createUser(createUserDto);
  }

  @Get()
  @ApiQuery({
    name: 'role',
    type: String,
    description: 'User role',
    required: false,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Get users by roles',
    type: () => UserSchema,
    isArray: true,
  })
  @ApiOperation({
    summary: 'Get users',
  })
  @HttpCode(HttpStatus.OK)
  async getUsers(@Query('role') role: string) {
    return await this.usersService.getUsers(role);
  }

  @Delete()
  @ApiQuery({
    name: 'id',
    type: String,
    description: 'User id (ObjectId)',
    required: true,
  })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
  })
  @ApiOperation({
    summary: 'Delete user',
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteUser(@Query('id', new ParseMongoIdPipe()) id: Types.ObjectId) {
    await this.usersService.deleteUser(id);
  }

  @Post('/reset/password')
  @ApiQuery({
    name: 'id',
    type: String,
    description: 'User id (ObjectId)',
    required: true,
  })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
  })
  @ApiOperation({
    summary: 'Reset user password',
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  async updateUser(@Query('id', new ParseMongoIdPipe()) id: Types.ObjectId) {
    await this.usersService.resetPassword(id);
  }
}
