import { maxUsernameLength } from '@/users/dto/user.create.dto';
import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: 'MaxUsernameLength', async: false })
export class MaxUsernameLength implements ValidatorConstraintInterface {
  validate(value: string): boolean {
    return value.length <= maxUsernameLength;
  }
}
