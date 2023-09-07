import { BadRequestException } from '@nestjs/common';
import { TransformFnParams } from 'class-transformer';

export class Transformation<T> {
  constructor(
    private readonly transformFunction: (value: any) => T,
    private readonly nullable = true,
    private readonly protoName = '',
  ) {}

  value(): (param: TransformFnParams) => T {
    return ({ key, value }) => {
      if (!this.nullable && !value) {
        throw new BadRequestException(`${key} is required`);
      }
      try {
        return value ? this.transformFunction(value) : null;
      } catch (e) {
        throw new BadRequestException({
          message: e?.message ?? `${key} is invalid type`,
          expected: this.protoName,
        });
      }
    };
  }

  array(): (param: TransformFnParams) => T[] {
    return ({ key, value }) => {
      if (!this.nullable && !value) {
        throw new BadRequestException(`${key} is required`);
      }
      if (!Array.isArray(value)) {
        throw new BadRequestException({
          message: `${key} is invalid type`,
          expect: `Array<${this.protoName}>`,
        });
      }
      return value
        ? value.map((v: any, i) => {
            try {
              return this.transformFunction(v);
            } catch (e) {
              throw new BadRequestException({
                message: `${key} is invalid type @ index ${i}`,
                ogMessage: e?.message,
                expected: this.protoName,
              });
            }
          })
        : null;
    };
  }
}
