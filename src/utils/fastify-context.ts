import { FastifyRequest } from 'fastify';
export class FastifyContext {
  constructor(private readonly req: FastifyRequest) {}

  get<T = any>(key: string): T {
    return this.req.raw[key];
  }

  set<T = any>(key: string, value: T) {
    this.req.raw[key] = value;
  }
}
