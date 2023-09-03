import { UserRole } from '@/schema/users.schema';
import { BadRequestException } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsString } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ type: String, description: 'username is string' })
  @IsString()
  username: string;

  @ApiProperty({ type: String, description: 'password is string' })
  @IsString()
  password: string;

  @ApiProperty({
    type: String,
    enum: UserRole,
    example: ['Owner', 'Chef', 'Cashier', 'Employee', 'Customer'],
    description:
      'select role from enum UserRole example: Owner, Chef, Cashier, Employee, Customer',
  })
  @IsString()
  @Transform(({ value }) => {
    const role: UserRole | undefined =
      UserRole[
        `${(<string>value)?.[0].toUpperCase()}${(<string>value)?.slice(1)}`
      ];

    if (!role) {
      throw new BadRequestException({
        message: 'Invalid role',
      });
    }

    return role;
  })
  role: UserRole;
}
