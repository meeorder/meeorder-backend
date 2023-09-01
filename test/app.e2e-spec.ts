import { AppModule } from '@/app.module';
import { SwaggerBuilder } from '@/document';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { Test, TestingModule } from '@nestjs/testing';

describe('Generate Swagger API (JSON)', () => {
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
    const document = new SwaggerBuilder(app).createDocument();
    require('fs').writeFileSync('./swagger.json', JSON.stringify(document));
  });

  afterEach(async () => {
    await app.close();
  });
});
