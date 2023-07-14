import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from './../src/app.module';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
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
      url: '/api/v1/health',
    });
    expect(statusCode).toBe(200);
    const parsedPayload: HealthResponseDto = JSON.parse(payload);
    expect(parsedPayload).toHaveProperty('createdAt');
    expect(parsedPayload.status).toBe('OK');
  });
});
