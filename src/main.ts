import fastifyCookie from '@fastify/cookie';
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
  app.useGlobalPipes(
    new ValidationPipe({ transform: true, forbidNonWhitelisted: true }),
  );

  await app.register(fastifyCookie, {
    secret: 'my-secret', // for cookies signature
    parseOptions: {
      sameSite: 'none',
      secure: true,
    },
  });

  new SwaggerBuilder(app).setup();
  const configService = app.get(ConfigService);
  app.enableCors({
    origin: new RegExp('(.*)'),
    credentials: true,
  });
  await app.listen(configService.get(Config.PORT), '0.0.0.0');
}
bootstrap();
