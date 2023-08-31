import { CreateUserDto } from '@/users/dto/user.create.dto';
import { UsersService } from '@/users/users.service';
import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Query,
} from '@nestjs/common';
import { ApiBody, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';

@Controller({ path: 'users', version: '1' })
@ApiTags('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post()
  @ApiBody({ type: CreateUserDto })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'Create user' })
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
    type: () => [CreateUserDto],
    isArray: true,
  })
  @HttpCode(HttpStatus.OK)
  async getUsers(@Query('role') role: string) {
    return await this.usersService.getUsers(role);
  }
}
