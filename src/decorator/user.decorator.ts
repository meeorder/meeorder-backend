import { UserJwt } from '@/auth/user.jwt.payload';
import { FastifyContext } from '@/utils/fastify-context';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { FastifyRequest } from 'fastify';

export const User = createParamDecorator((_, ctx: ExecutionContext) => {
  const user = new FastifyContext(
    ctx.switchToHttp().getRequest<FastifyRequest>(),
  ).get<UserJwt>('user');
  return user;
});
