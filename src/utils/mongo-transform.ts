import { Transformation } from '@/utils/transformation';
import { Types } from 'mongoose';

export class MongoTransform extends Transformation<Types.ObjectId> {
  constructor(nullable = false) {
    super((v) => new Types.ObjectId(v), nullable, Types.ObjectId.name);
  }
}
