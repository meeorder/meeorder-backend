import {
  HttpException,
  HttpStatus,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import { Types } from 'mongoose';

@Injectable()
export class ParseMongoIdPipe implements PipeTransform {
  transform(value: any) {
    try {
      return new Types.ObjectId(value);
    } catch (e) {
      throw new HttpException('Invalid ObjectId', HttpStatus.BAD_REQUEST);
    }
  }
}
