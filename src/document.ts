import { NestFastifyApplication } from '@nestjs/platform-fastify';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export class SwaggerBuilder {
  private readonly documentBuilder: DocumentBuilder;
  constructor(private readonly app: NestFastifyApplication) {
    this.documentBuilder = new DocumentBuilder()
      .setTitle('MeeOrder')
      .setDescription('The MeeOrder API description')
      .setVersion('1.0');
  }

  setup() {
    const docs = SwaggerModule.createDocument(
      this.app,
      this.documentBuilder.build(),
    );
    SwaggerModule.setup('docs', this.app, docs);
  }
}
