import { CustomTransform } from '@/utils/custom-transform';
import { Types } from 'mongoose';

export class MongoTransform extends CustomTransform<Types.ObjectId> {
  constructor(nullable = false) {
    super((v) => new Types.ObjectId(v), nullable, Types.ObjectId.name);
  }
}
