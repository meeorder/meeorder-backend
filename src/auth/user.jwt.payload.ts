import { UserRole } from '@/schema/users.schema';

export class UserJwtPayload {
  id: string;

  username: string;

  role: UserRole;

  constructor(base: UserJwtPayload) {
    this.id = base.id;
    this.username = base.username;
    this.role = base.role;
  }

  isHavePermission(role: UserRole) {
    return this.role >= role;
  }
}
