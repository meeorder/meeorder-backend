import { ValidationPipe, VersioningType } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { AppModule } from './app.module';
import { Config } from './config';
import { SwaggerBuilder } from './document';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );

  app.enableVersioning({
    type: VersioningType.URI,
    prefix: 'api/v',
  });
  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  new SwaggerBuilder(app).setup();
  const configService = app.get(ConfigService);
  app.enableCors({
    origin: new RegExp('(.*)'),
  });
  await app.listen(configService.get(Config.PORT), '0.0.0.0');
}
bootstrap();
