import { UserRole } from '@/schema/users.schema';
import { UserRoleString } from '@/users/dto/user.create.dto';
import { UserRoleTransform } from '@/utils/role-transoform';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class UpdateRoleDto {
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
