import {
  HttpException,
  HttpStatus,
  Injectable,
  PipeTransform,
} from '@nestjs/common';

@Injectable()
export class ParseMongoDatePipe implements PipeTransform {
  transform(value: number) {
    try {
      const mul = 1000;
      return new Date(+value * mul);
    } catch (e) {
      throw new HttpException('Invalid UnixTimeStamp', HttpStatus.BAD_REQUEST);
    }
  }
}
