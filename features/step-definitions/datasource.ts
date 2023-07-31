import { getModelForClass } from '@typegoose/typegoose';
import {
  AnyParamConstructor,
  IModelOptions,
} from '@typegoose/typegoose/lib/types';
import mongoose from 'mongoose';

export class Datasource {
  constructor(private readonly connection: mongoose.Connection) {}

  async connect() {
    await this.connection.asPromise();
    return this;
  }

  async disconnect() {
    await this.connection.close();
  }

  getModel(
    cl: AnyParamConstructor<any>,
    options?: Pick<IModelOptions, 'options' | 'schemaOptions'>,
  ) {
    return getModelForClass(cl, {
      existingConnection: this.connection,
      ...options,
    });
  }
}
