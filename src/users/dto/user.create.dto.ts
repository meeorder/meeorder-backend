import { UserRole } from '@/schema/users.schema';
import { UserRoleTransform } from '@/utils/role-transoform';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsAlphanumeric,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export const maxUsernameLength = 32;
export const minUsernameLength = 4;

export enum UserRoleString {
  Owner = 'Owner',
  Cashier = 'Cashier',
  Employee = 'Employee',
  Customer = 'Customer',
}

export class CreateUserDto {
  @ApiProperty({ type: String, description: 'Username' })
  @IsString()
  @MaxLength(maxUsernameLength)
  @MinLength(minUsernameLength)
  @IsAlphanumeric()
  username: string;

  @ApiProperty({ type: String, description: 'Password' })
  @IsString()
  password: string;

  @ApiProperty({
    type: String,
    enum: UserRoleString,
    example: UserRoleString.Owner,
    description:
      'select role from enum UserRole example: Owner, Chef, Cashier, Employee, Customer',
  })
  @Transform(new UserRoleTransform().value())
  role: UserRole;
}
