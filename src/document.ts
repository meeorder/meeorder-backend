import { NestFastifyApplication } from '@nestjs/platform-fastify';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export class SwaggerBuilder {
  private readonly documentBuilder: DocumentBuilder;

  constructor(private readonly app: NestFastifyApplication) {
    this.documentBuilder = new DocumentBuilder()
      .setTitle('MeeOrder')
      .setDescription('The MeeOrder API description')
      .setVersion('1.0')
      .addBearerAuth();
  }

  createDocument() {
    return SwaggerModule.createDocument(this.app, this.documentBuilder.build());
  }

  setup() {
    const docs = this.createDocument();

    SwaggerModule.setup('docs', this.app, docs);
  }
}
