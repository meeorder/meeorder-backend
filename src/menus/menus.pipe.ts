import { Injectable, PipeTransform } from '@nestjs/common';
import { Types } from 'mongoose';
@Injectable()
export class ParseStringArrayToObjectIdArrayPipe implements PipeTransform {
  transform(value: string[]) {
    const objectIdArray = value.map((v) => new Types.ObjectId(v));
    return objectIdArray;
  }
}
