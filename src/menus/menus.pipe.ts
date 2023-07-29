import { Injectable, PipeTransform } from '@nestjs/common';
import { Types } from 'mongoose';
@Injectable()
export class ParseStringObjectIdArrayPipe implements PipeTransform {
  transform(value: string) {
    const objectIdArray = value.split(',').map((v) => new Types.ObjectId(v));
    return objectIdArray;
  }
}
