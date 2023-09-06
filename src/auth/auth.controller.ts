import { LoginDto } from '@/auth/dto/login.dto';
import { LoginResponseDto } from '@/auth/dto/login.response.dto';
import { RegisterDto } from '@/auth/dto/register.dto';
import { UserJwt } from '@/auth/user.jwt.payload';
import { User } from '@/decorator/user.decorator';
import { UserResponseDto } from '@/users/dto/user.response.dto';
import { UsersService } from '@/users/users.service';
import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Res,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { FastifyReply } from 'fastify';
import { Types } from 'mongoose';
import { AuthService } from './auth.service';

@Controller({ path: 'auth', version: '1' })
@ApiTags('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UsersService,
  ) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  @ApiOperation({ summary: 'Login' })
  @ApiResponse({ type: () => LoginResponseDto, status: HttpStatus.OK })
  async signIn(
    @Body() signInDto: LoginDto,
    @Res({ passthrough: true }) response: FastifyReply,
  ) {
    const token = await this.authService.signIn(
      signInDto.username,
      signInDto.password,
    );
    response.setCookie('jwt-meeorder', token, { path: '/' });
    return new LoginResponseDto(token);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Post('logout')
  @ApiOperation({ summary: 'Logout' })
  @ApiResponse({ status: HttpStatus.NO_CONTENT })
  signOut(@Res({ passthrough: true }) response: FastifyReply) {
    response.clearCookie('jwt-meeorder', { path: '/' });
  }

  @HttpCode(HttpStatus.CREATED)
  @Post('register')
  @ApiOperation({ summary: "Customer's registraion" })
  @ApiResponse({ type: () => RegisterDto, status: HttpStatus.CREATED })
  async register(@Body() registerDto: RegisterDto) {
    return await this.authService.register(registerDto);
  }

  @HttpCode(HttpStatus.OK)
  @Get('me')
  @ApiOperation({ summary: 'Get current user' })
  @ApiResponse({ type: () => UserResponseDto, status: HttpStatus.OK })
  async getMe(@User() { id }: UserJwt) {
    const user = await this.userService.getUserById(new Types.ObjectId(id));
    if (!user) {
      throw new BadRequestException({
        message: 'Incorrect user',
      });
    }
    return UserResponseDto.fromDocument(user);
  }
}
