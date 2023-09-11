import { UserRole } from '@/schema/users.schema';
import { BadRequestException } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsAlphanumeric,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

const maxUsernameLength = 32;
const minUsernameLength = 4;

enum UserRoleString {
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
    example: 'Owner',
    description:
      'select role from enum UserRole example: Owner, Chef, Cashier, Employee, Customer',
  })
  @Transform(({ value }) => {
    const transformed = `${(<string>value)?.[0].toUpperCase()}${(<string>(
      value
    ))?.slice(1)}`;
    const role: UserRole | undefined = UserRole[transformed];

    if (!role) {
      throw new BadRequestException({
        message: 'Invalid role',
      });
    }

    return role;
  })
  role: UserRole;
}
