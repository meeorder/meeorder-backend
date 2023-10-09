import {
  HttpException,
  HttpStatus,
  Injectable,
  PipeTransform,
} from '@nestjs/common';

@Injectable()
export class ParseMongoDateStartPipe implements PipeTransform {
  transform(value: number) {
    try {
      const hour = 86400;
      const new_value = value - (value % hour);
      const mul = 1000;
      return new Date(new_value * mul);
    } catch (e) {
      throw new HttpException('Invalid UnixTimeStamp', HttpStatus.BAD_REQUEST);
    }
  }
}
