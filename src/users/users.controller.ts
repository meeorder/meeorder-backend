import { Role } from '@/decorator/roles.decorator';
import { ParseMongoIdPipe } from '@/pipes/mongo-id.pipe';
import { UserRole, UserSchema } from '@/schema/users.schema';
import { CreateUserDto } from '@/users/dto/user.create.dto';
import { UserResponseDto } from '@/users/dto/user.response.dto';
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
  ApiBearerAuth,
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
  @ApiBearerAuth()
  @Role(UserRole.Owner)
  async createUser(@Body() createUserDto: CreateUserDto) {
    const doc = await this.usersService.createUser(createUserDto);

    return UserResponseDto.fromDocument(doc);
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
  @ApiBearerAuth()
  @Role(UserRole.Owner)
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
  @ApiBearerAuth()
  @Role(UserRole.Owner)
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
  @ApiBearerAuth()
  @Role(UserRole.Owner)
  @HttpCode(HttpStatus.NO_CONTENT)
  async updateUser(@Query('id', new ParseMongoIdPipe()) id: Types.ObjectId) {
    await this.usersService.resetPassword(id);
  }
}
