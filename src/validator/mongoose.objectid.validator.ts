import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { Types } from 'mongoose';

@ValidatorConstraint({ name: 'isObjectId', async: false })
export class IsObjectId implements ValidatorConstraintInterface {
  validate(text: string) {
    return Types.ObjectId.isValid(text);
  }
  defaultMessage(): string {
    return 'Invalid ObjectId';
  }
}
