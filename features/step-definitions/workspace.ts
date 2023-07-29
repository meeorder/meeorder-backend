import { Config, configuration } from '@/config';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { afterAll, beforeAll, binding, then } from 'cucumber-tsflow';
import expect from 'expect';
import mongoose from 'mongoose';

@binding()
export class Workspace {
  public mongooseConnection: mongoose.Connection;

  public response: AxiosResponse<any>;

  public axiosInstance: AxiosInstance;

  @beforeAll()
  async beforeAll() {
    const configService = new ConfigService(configuration());
    const mongoUri = configService.get<string>(Config.MONGO_URI);
    const mongoDbName = configService.get<string>(Config.MONGO_DB_NAME);
    const baseURL = configService
      .get<string>(Config.BASE_URL)
      .concat('/api/v1');

    this.mongooseConnection = await mongoose
      .createConnection(mongoUri, {
        dbName: mongoDbName,
      })
      .asPromise();

    this.axiosInstance = axios.create({ baseURL });
  }

  @afterAll()
  async afterAll() {
    await this.mongooseConnection.close();
  }

  @then('should return status code {int}')
  shouldReturnStatusCode(statusCode: number) {
    expect(this.response.status).toBe(statusCode);
  }

  @then('should appear {string} in response')
  shouldAppearInResponse(key: string) {
    expect(this.response.data).toHaveProperty(key);
  }
}
