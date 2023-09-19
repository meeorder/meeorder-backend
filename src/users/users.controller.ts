import { UserJwt } from '@/auth/user.jwt.payload';
import { Role } from '@/decorator/roles.decorator';
import { User } from '@/decorator/user.decorator';
import { ParseMongoIdPipe } from '@/pipes/mongo-id.pipe';
import { UserRole, UserSchema } from '@/schema/users.schema';
import { CreateUserDto } from '@/users/dto/user.create.dto';
import { UserResponseDto } from '@/users/dto/user.response.dto';
import { UpdateInfoDto } from '@/users/dto/user.update.info.dto';
import { UpdateRoleDto } from '@/users/dto/user.update.role.dto';
import { UsersService } from '@/users/users.service';
import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
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
  async deleteUser(
    @User() { id }: UserJwt,
    @Query('id', new ParseMongoIdPipe()) deleteId: Types.ObjectId,
  ) {
    if (deleteId.equals(id)) {
      throw new BadRequestException({
        message: 'Cannot delete yourself',
      });
    }
    await this.usersService.deleteUser(deleteId);
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
  async updateUser(
    @User() { id }: UserJwt,
    @Query('id', new ParseMongoIdPipe()) resetId: Types.ObjectId,
  ) {
    if (resetId.equals(id)) {
      throw new BadRequestException({
        message: 'Cannot reset password yourself',
      });
    }
    await this.usersService.resetPassword(resetId);
  }

  @Patch('/:id/role')
  @ApiParam({
    name: 'id',
    type: String,
    description: 'User id (ObjectId)',
    required: true,
  })
  @ApiBody({
    type: () => UpdateRoleDto,
  })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
  })
  @ApiOperation({
    summary: 'Update user role',
  })
  @ApiBearerAuth()
  @Role(UserRole.Owner)
  @HttpCode(HttpStatus.NO_CONTENT)
  async updateUserRole(
    @User() { id }: UserJwt,
    @Param('id', new ParseMongoIdPipe()) UpdateId: Types.ObjectId,
    @Body() updateRoleDto: UpdateRoleDto,
  ) {
    if (UpdateId.equals(id)) {
      throw new BadRequestException({
        message: 'Cannot update role yourself',
      });
    }
    await this.usersService.updateRole(
      new Types.ObjectId(UpdateId),
      updateRoleDto,
    );
  }

  @Patch()
  @ApiBody({ type: () => UpdateInfoDto })
  @ApiResponse({ status: HttpStatus.NO_CONTENT })
  @ApiOperation({ summary: 'Update User info' })
  @ApiBearerAuth()
  @Role(UserRole.Customer)
  @HttpCode(HttpStatus.NO_CONTENT)
  async updateUserInfo(
    @User() { id }: UserJwt,
    @Body() updateInfoDto: UpdateInfoDto,
  ) {
    await this.usersService.updateUserInfo(
      new Types.ObjectId(id),
      updateInfoDto,
    );
  }
}
