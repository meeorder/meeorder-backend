import { AppModule } from '@/app.module';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Test, TestingModule } from '@nestjs/testing';

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

  it('should generate swagger spec', () => {
    const config = new DocumentBuilder()
      .setTitle('My API')
      .setDescription('My API')
      .setVersion('1.0')
      .build();

    const document = SwaggerModule.createDocument(app, config);
    require('fs').writeFileSync('./swagger.json', JSON.stringify(document));
  });

  afterEach(async () => {
    await app.close();
  });
});
