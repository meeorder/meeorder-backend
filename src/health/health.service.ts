import { HealthSchema } from '@/schema/health.schema';
import { Injectable } from '@nestjs/common';
import { DocumentType, ReturnModelType } from '@typegoose/typegoose';
import { InjectModel } from 'nest-typegoose';

@Injectable()
export class HealthService {
  constructor(
    @InjectModel(HealthSchema)
    private readonly healthModel: ReturnModelType<typeof HealthSchema>,
  ) {}

  async createRecord(): Promise<HealthSchema> {
    const doc: DocumentType<HealthSchema> = await this.healthModel.create({});
    return doc.toObject({ virtuals: true });
  }
}
