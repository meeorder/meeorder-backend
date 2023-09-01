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

    if (await argon2.verify(user.password, password)) {
      // password match
      return this.jwtService.signAsync({
        username: user.username,
        id: user.id,
      });
    } else {
      // password did not match
      throw new UnauthorizedException();
    }
  }
}
