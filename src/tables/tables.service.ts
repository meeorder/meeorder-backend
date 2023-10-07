import { TablesSchema } from '@/schema/tables.schema';
import { ErrorDto } from '@/utils/errors/error.dto';
import { Injectable, NotFoundException } from '@nestjs/common';
import { DocumentType, ReturnModelType } from '@typegoose/typegoose';
import { Types } from 'mongoose';
import { InjectModel } from 'nest-typegoose';

@Injectable()
export class TablesService {
  constructor(
    @InjectModel(TablesSchema)
    private readonly tablesModel: ReturnModelType<typeof TablesSchema>,
  ) {}

  async createTable(title: string) {
    return await this.tablesModel.create({ title });
  }

  async getTables() {
    const tables = await this.tablesModel.find().exec();
    return tables;
  }

  deleteTable(id: Types.ObjectId) {
    return this.tablesModel
      .updateOne(
        { _id: id },
        {
          $set: {
            deleted_at: new Date(),
          },
        },
      )
      .orFail(new NotFoundException(new ErrorDto('Table not found')))
      .exec();
  }

  updateTable(
    id: Types.ObjectId,
    table: Partial<TablesSchema>,
  ): Promise<DocumentType<TablesSchema>> {
    return this.tablesModel
      .findByIdAndUpdate(
        id,
        {
          $set: table,
        },
        { new: true },
      )
      .orFail(new NotFoundException(new ErrorDto('Table not found')))
      .exec();
  }
}
