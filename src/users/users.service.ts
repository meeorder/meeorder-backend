import { UserRole, UserSchema } from '@/schema/users.schema';
import { CreateUserDto } from '@/users/dto/user.create.dto';
import { Injectable } from '@nestjs/common';
import { ReturnModelType } from '@typegoose/typegoose';
import * as argon2 from 'argon2';
import { InjectModel } from 'nest-typegoose';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(UserSchema)
    private readonly userModel: ReturnModelType<typeof UserSchema>,
  ) {}

  async createUser(createUserDto: CreateUserDto) {
    const hashedPassword = await argon2.hash(createUserDto.password);
    return await this.userModel.create({
      username: createUserDto.username,
      password: hashedPassword,
      role: UserRole[createUserDto.role],
    });
  }

  async getUsers(role: string = undefined) {
    if (!role) {
      return await this.userModel.find();
    }
    return await this.userModel.find({ role: UserRole[role] });
  }
}
