import { LoginDto } from '@/auth/dto/login.dto';
import { LoginResponseDto } from '@/auth/dto/login.response.dto';
import { RegisterDto } from '@/auth/dto/register.dto';
import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Res,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { FastifyReply } from 'fastify';
import { AuthService } from './auth.service';

@Controller({ path: 'auth', version: '1' })
@ApiTags('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  @ApiOperation({ summary: 'Login' })
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
  signOut(@Res({ passthrough: true }) response: FastifyReply) {
    response.clearCookie('jwt-meeorder', { path: '/' });
  }

  @HttpCode(HttpStatus.CREATED)
  @Post('register')
  @ApiOperation({ summary: "Customer's registraion" })
  async register(@Body() registerDto: RegisterDto) {
    return await this.authService.register(registerDto);
  }
}
