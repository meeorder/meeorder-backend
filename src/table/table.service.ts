import { TableSchema } from '@/schema/table.schema';
import { Injectable } from '@nestjs/common';
import { DocumentType, ReturnModelType } from '@typegoose/typegoose';
import { InjectModel } from 'nest-typegoose';

@Injectable()
export class TableService {
  constructor(
    @InjectModel(TableSchema)
    private readonly tableModel: ReturnModelType<typeof TableSchema>,
  ) {}

  createTable(id: number) {
    return this.tableModel.create({ _id: id });
  }

  getTables(): Promise<DocumentType<TableSchema>[]> {
    return this.tableModel.find().exec();
  }
}
