import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  TypegooseModuleOptions,
  TypegooseOptionsFactory,
} from 'nest-typegoose';
import { Config } from '.';

@Injectable()
export class TypegooseConfigService implements TypegooseOptionsFactory {
  constructor(private readonly configService: ConfigService) {}

  createTypegooseOptions(): TypegooseModuleOptions {
    return {
      uri: this.configService.get<string>(Config.MONGO_URI),
      dbName: this.configService.get<string>(Config.MONGO_DB_NAME),
    };
  }
}
