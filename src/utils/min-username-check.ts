import { minUsernameLength } from '@/users/dto/user.create.dto';
import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: 'MinUsernameLength', async: false })
export class MinUsernameLength implements ValidatorConstraintInterface {
  validate(value: string): boolean {
    return value.length >= minUsernameLength;
  }
}
