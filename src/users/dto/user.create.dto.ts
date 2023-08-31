import { UserRole } from '@/schema/users.schema';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsString } from 'class-validator';

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
  @IsEnum(UserRole)
  role: UserRole;
}
