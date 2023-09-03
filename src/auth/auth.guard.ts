import { UserJwt } from '@/auth/user.jwt.payload';
import { Role } from '@/decorator/roles.decorator';
import { FastifyContext } from '@/utils/fastify-context';
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { FastifyRequest } from 'fastify';

@Injectable()
export class AuthGuard implements CanActivate {
  private readonly logger = new Logger(AuthGuard.name);

  constructor(
    private reflector: Reflector,
    private readonly jwtService: JwtService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest<FastifyRequest>();
    const token = /Bearer (.*)/.exec(req.headers.authorization)?.[1];
    const role = this.reflector.get(Role, context.getHandler());
    if (!role) {
      return true;
    }
    if (!token) {
      throw new UnauthorizedException({ message: 'Unauthorized' });
    }
    try {
      const decoded = await this.jwtService
        .verifyAsync(token)
        .then(UserJwt.fromDecode);
      new FastifyContext(req).set('user', decoded);
      return decoded.isHavePermission(role);
    } catch (err) {
      this.logger.error('Decrypt token failed', err);
    }
  }
}
