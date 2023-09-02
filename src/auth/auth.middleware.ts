import { UserJwt } from '@/auth/user.jwt.payload';
import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { FastifyReply } from 'fastify';
import { IncomingMessage } from 'http';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  private readonly logger = new Logger(AuthMiddleware.name);

  constructor(private readonly jwtService: JwtService) {}

  async use(
    req: IncomingMessage,
    res: FastifyReply,
    next: (error?: any) => void,
  ) {
    const token = /Bearer (.*)/.exec(req.headers.authorization)?.[1];
    if (token) {
      try {
        const decoded = await this.jwtService
          .verifyAsync(token)
          .then(UserJwt.fromDecode);
        req['user'] = decoded;
      } catch (err) {
        this.logger.error('Decrypt token failed', err);
      }
    }
    next();
  }
}
