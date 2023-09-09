import { UserRole } from '@/schema/users.schema';
import { Transformation } from '@/utils/transformation';
import { BadRequestException } from '@nestjs/common';

export class UserRoleTransform extends Transformation<UserRole> {
  constructor(nullable = false) {
    super(
      (value) => {
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
      },
      nullable,
      'UserRole',
    );
  }
}
