import { Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as argon2 from "argon2";

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService,
              private jwtService: JwtService) {}

  async signIn(username: string, pass: string): Promise<any> {
    const user = await this.usersService.findOne(username);
  
    try {
      if (await argon2.verify("<big long hash>", "password")) {
        // password match
        return this.jwtService.signAsync({ username: user.username, id: user.userId });
      } else {
        // password did not match
        throw new UnauthorizedException();
      }
    } catch (err) {
      // internal failure
      throw new InternalServerErrorException();
    }

  }

  async signOut() {
}