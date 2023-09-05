import { TablesSchema } from '@/schema/tables.schema';
import { Injectable } from '@nestjs/common';
import { ReturnModelType } from '@typegoose/typegoose';
import { InjectModel } from 'nest-typegoose';

@Injectable()
export class TablesService {
  constructor(
    @InjectModel(TablesSchema)
    private readonly tablesModel: ReturnModelType<typeof TablesSchema>,
  ) {}

  async createTable(table_number: number) {
    return await this.tablesModel.create({ table_number });
  }

  async getTables() {
    const tables = await this.tablesModel.find().exec();
    return tables;
  }
}
