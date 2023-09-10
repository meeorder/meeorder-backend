import { Config, configuration } from '@/config';
import { DataTable } from '@cucumber/cucumber';
import { ConfigService } from '@nestjs/config';
import axios, {
  AxiosInstance,
  AxiosResponse,
  RawAxiosRequestHeaders,
} from 'axios';
import { afterAll, beforeAll, binding, then } from 'cucumber-tsflow';
import expect from 'expect';
import { Datasource } from 'features/step-definitions/datasource';
import mongoose from 'mongoose';

@binding()
export class Workspace {
  public static responseDtMapType(
    hashedDt: { key: string; value: string; type: string }[],
  ): { key: string; value: any; type: string }[] {
    return hashedDt.map((item) => {
      switch (item.type) {
        case 'number':
          return { ...item, value: +item.value };
        case 'boolean':
          return { ...item, value: item.value === 'true' };
        case 'null':
          return { ...item, value: null };
        case 'undefined':
          return { ...item, value: undefined };
        case 'array':
          return { ...item, value: item.value ? item.value.split(',') : [] };
        default:
          return item;
      }
    });
  }

  public datasource: Datasource;

  private _response: AxiosResponse<any>;

  private cookies: Record<string, string> = {};

  private extractCookie(res: AxiosResponse<any>) {
    const cookies = res.headers['set-cookie'];
    const extractregEx = /(.*)=(.*); Path=(.*)/;
    if (cookies) {
      for (const cookie of cookies) {
        const [key, value] = extractregEx.exec(cookie).slice(1);
        this.cookies[key] = value;
      }
    }
  }

  get response() {
    return this._response;
  }

  set response(res) {
    this._response = res;
    this.extractCookie(res);
  }

  public axiosInstance: AxiosInstance;

  public baseURL: string;

  public getAxiosInstance(version?: string) {
    return axios.create({
      baseURL: version ? `${this.baseURL}/api/v${version}` : this.baseURL,
      validateStatus: () => true,
    });
  }

  public setHeader(key: keyof RawAxiosRequestHeaders, value: string) {
    this.axiosInstance.defaults.headers.common[key] = value;
  }

  @beforeAll()
  async beforeAll() {
    const configService = new ConfigService(configuration());
    const mongoUri = configService.get<string>(Config.MONGO_URI);
    const mongoDbName = configService.get<string>(Config.MONGO_DB_NAME);
    this.baseURL = configService.get<string>(Config.BASE_URL);

    const connection = mongoose.createConnection(mongoUri, {
      dbName: mongoDbName,
    });

    this.datasource = await new Datasource(connection).connect();

    this.axiosInstance = this.getAxiosInstance('1');
  }

  @afterAll()
  async afterAll() {
    await this.datasource.disconnect();
  }

  @then('should return status code {int}')
  shouldReturnStatusCode(statusCode: number) {
    expect(this.response.status).toBe(statusCode);
  }

  @then('should appear {string} in response')
  shouldAppearInResponse(key: string) {
    expect(this.response.data).toHaveProperty(key);
  }

  @then('{string} field should not be null in response')
  fieldShouldBeNullInResponse(key: string) {
    expect(this.response.data[key]).not.toBeNull();
  }

  @then('should response data be')
  shouldResponseDataBe(dt: DataTable) {
    const expected = Workspace.responseDtMapType(
      <{ key: string; value: string; type: string }[]>dt.hashes(),
    );

    for (const expectItem of expected) {
      expect(this.response.data[expectItem.key]).toEqual(expectItem.value);
    }
  }

  @then('should response be length {int}')
  responseLength(length: number) {
    expect(Array.isArray(this.response.data)).toBeTruthy();
    expect(this.response.data).toHaveLength(length);
  }
}
