import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { HealthClass } from 'src/schema/health.schema';

@Injectable()
export class HealthService {
  constructor(
    @InjectModel(HealthClass.name)
    private readonly healthModel: Model<HealthClass>,
  ) {}
  createRecord() {
    return this.healthModel.create({});
  }
}
