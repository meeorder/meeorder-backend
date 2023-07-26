import { AppModule } from '@/app.module';
import { Config } from '@/config';
import { TableSchema } from '@/schema/table.schema';
import { HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { Test, TestingModule } from '@nestjs/testing';
import { getModelForClass } from '@typegoose/typegoose';
import mongoose from 'mongoose';

describe('table', () => {
  let app: NestFastifyApplication;
  let connection: mongoose.Connection;
  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication<NestFastifyApplication>(
      new FastifyAdapter(),
    );
    await app.init();
    await app.getHttpAdapter().getInstance().ready();

    const configService = app.get(ConfigService);
    connection = await mongoose
      .createConnection(configService.get<string>(Config.MONGO_URI), {
        dbName: 'meeorder',
      })
      .asPromise();
  });

  afterEach(async () => {
    await connection.close();
    await app.close();
  });

  it('should be defined', () => {
    expect(app).toBeDefined();
    expect(connection?.readyState).toBe(1);
  });

  describe('create table', () => {
    it('should created and return table', async () => {
      const tableModel = getModelForClass(TableSchema, {
        existingConnection: connection,
      });

      await tableModel.deleteMany({}).exec();
      const { payload, statusCode } = await app.inject({
        method: 'POST',
        url: '/tables',
        body: {
          id: 1,
        },
      });

      console.log(payload);

      expect(statusCode).toBe(HttpStatus.CREATED);
      const parsedPayload: TableSchema = JSON.parse(payload);
      expect(parsedPayload.id).toBe(1);

      await expect(
        tableModel.findById(parsedPayload.id).orFail().exec(),
      ).resolves.toBeTruthy();
    });
  });

  describe('get tables', () => {
    it('should return all tables', async () => {
      const expected: Partial<TableSchema>[] = [
        {
          id: 1,
        },
        { id: 2 },
      ];

      const tableModel = getModelForClass(TableSchema, {
        existingConnection: connection,
      });
      await tableModel.deleteMany({}).exec();
      await tableModel.insertMany(expected);

      const { payload, statusCode } = await app.inject({
        method: 'GET',
        url: '/tables',
      });

      expect(statusCode).toBe(HttpStatus.OK);

      const parsedPayload: Partial<TableSchema>[] = JSON.parse(payload);

      expect(parsedPayload).toBeInstanceOf(Array);
      expect(parsedPayload).toHaveLength(expected.length);

      parsedPayload.forEach((table, index) =>
        expect(table.id).toBe(expect[index].id),
      );
    });
  });
});
