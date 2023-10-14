import { UserRole } from '@/schema/users.schema';
import { MaxUsernameLength } from '@/utils/max-username-check';
import { MinUsernameLength } from '@/utils/min-username-check';
import { UserRoleTransform } from '@/utils/role-transoform';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsAlphanumeric, IsString, Validate } from 'class-validator';

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
  @IsAlphanumeric()
  @Validate(MinUsernameLength, {
    message: 'ชื่อผู้ใช้ต้องมีความยาวมากกว่าหรือเท่ากับ 4 ตัวอักษร',
  })
  @Validate(MaxUsernameLength, {
    message: 'ชื่อผู้ใช้ต้องมีความยาวน้อยกว่าหรือเท่ากับ 32 ตัวอักษร',
  })
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
