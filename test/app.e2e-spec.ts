import { AppModule } from '@/app.module';
import { HttpStatus } from '@nestjs/common';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { Test, TestingModule } from '@nestjs/testing';
import { HealthResponseDto } from 'src/health/dto/health.response.dto';

describe('AppController (e2e)', () => {
  let app: NestFastifyApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication<NestFastifyApplication>(
      new FastifyAdapter(),
    );
    await app.init();
    await app.getHttpAdapter().getInstance().ready();
  });

  it('/health (GET)', async () => {
    const { payload, statusCode } = await app.inject({
      method: 'GET',
      url: '/health',
    });
    expect(statusCode).toBe(HttpStatus.OK);
    const parsedPayload: HealthResponseDto = JSON.parse(payload);
    expect(parsedPayload).toHaveProperty('createdAt');
    expect(parsedPayload.status).toBe('OK');
  });

  afterEach(async () => {
    await app.close();
  });
});
