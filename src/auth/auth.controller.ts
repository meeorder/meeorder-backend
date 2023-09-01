import { LoginDto } from '@/auth/dto/login.dto';
import { Body, Controller, HttpCode, HttpStatus, Post, Res } from '@nestjs/common';
import { FastifyReply } from 'fastify';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  async signIn(@Body() signInDto: LoginDto, @Res({ passthrough: true}) response: FastifyReply) {
    const token = await this.authService.signIn(signInDto.username, signInDto.password);
    response.setCookie('jwt-meeorder', 'Bearer ' + token)
  }

  @HttpCode(HttpStatus.OK)
  @Post('logout')
  async signOut(@Res({ passthrough: true}) response: FastifyReply) {
    response.clearCookie('jwt-meeorder')
  }
  
}