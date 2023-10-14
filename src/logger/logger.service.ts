import { StatusLogSchema, StatusLogType } from '@/schema/status.log.schema';
import { Injectable } from '@nestjs/common';
import { ReturnModelType } from '@typegoose/typegoose';
import { Types } from 'mongoose';
import { InjectModel } from 'nest-typegoose';

@Injectable()
export class LoggerService {
  constructor(
    @InjectModel(StatusLogSchema)
    private readonly statusLogModel: ReturnModelType<typeof StatusLogSchema>,
  ) {}

  createAddonLog(ids: Types.ObjectId[], by: Types.ObjectId, value: boolean) {
    return this.statusLogModel.create({
      modified_ids: ids,
      type: StatusLogType.Addon,
      modified_value: value,
      modified_by: by,
    });
  }

  createIngredientLog(
    ids: Types.ObjectId[],
    by: Types.ObjectId,
    value: boolean,
  ) {
    return this.statusLogModel.create({
      modified_ids: ids,
      type: StatusLogType.Ingredient,
      modified_value: value,
      modified_by: by,
    });
  }
}
