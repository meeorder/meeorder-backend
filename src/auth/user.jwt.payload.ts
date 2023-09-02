import { UserRole } from '@/schema/users.schema';

export class UserJwt {
  id: string;

  username: string;

  role: UserRole;

  constructor(base: UserJwt) {
    this.id = base.id;
    this.username = base.username;
    this.role = base.role;
  }

  isHavePermission(role: UserRole) {
    return this.role >= role;
  }

  static fromDecode(decoded: any): UserJwt {
    return new UserJwt(decoded);
  }
}
