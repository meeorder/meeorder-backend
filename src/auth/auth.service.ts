import { UserRole } from '@/schema/users.schema';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signIn(username: string, password: string): Promise<string> {
    const user = await this.usersService.getUserByUsername(username);
    if (!user) {
      throw new UnauthorizedException({
        message: 'Username or password is incorrect',
      });
    }
    const isMatched = await argon2.verify(user.password, password);

    if (isMatched) {
      const token = await this.jwtService.signAsync(
        {
          username: user.username,
          id: user.id,
        },
        { expiresIn: user.role > UserRole.Employee ? '30d' : '1d' },
      );

      return token;
    } else {
      throw new UnauthorizedException({
        message: 'Username or password is incorrect',
      });
    }
  }
}
