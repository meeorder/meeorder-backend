import { UserRole } from '@/schema/users.schema';
import { UserRoleTransform } from '@/utils/role-transoform';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsString } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ type: String, description: 'Username' })
  @IsString()
  username: string;

  @ApiProperty({ type: String, description: 'Password' })
  @IsString()
  password: string;

  @ApiProperty({
    type: String,
    enum: UserRole,
    example: ['Owner', 'Chef', 'Cashier', 'Employee', 'Customer'],
    description:
      'select role from enum UserRole example: Owner, Chef, Cashier, Employee, Customer',
  })
  @Transform(new UserRoleTransform().value())
  role: UserRole;
}
