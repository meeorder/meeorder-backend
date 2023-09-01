import { UserRole, UserSchema } from '@/schema/users.schema';
import { CreateUserDto } from '@/users/dto/user.create.dto';
import { UserResponseDto } from '@/users/dto/user.response.dto';
import { Injectable } from '@nestjs/common';
import { ReturnModelType } from '@typegoose/typegoose';
import * as argon2 from 'argon2';
import { Types } from 'mongoose';
import { InjectModel } from 'nest-typegoose';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(UserSchema)
    private readonly userModel: ReturnModelType<typeof UserSchema>,
  ) {}

  async createUser(createUserDto: CreateUserDto): Promise<UserResponseDto> {
    const hashedPassword = await argon2.hash(createUserDto.password);
    const createdUser = await this.userModel.create({
      username: createUserDto.username,
      password: hashedPassword,
      role: UserRole[createUserDto.role],
    });
    return {
      _id: createdUser._id,
      username: createdUser.username,
      role: createdUser.role,
    };
  }

  async getUsers(role: string = undefined) {
    if (!role) {
      return await this.userModel.find({}, { password: false }).exec();
    }
    return await this.userModel
      .find({ role: UserRole[role] }, { password: false })
      .exec();
  }

  async deleteUser(id: Types.ObjectId) {
    await this.userModel
      .findByIdAndUpdate(id, {
        deleted_at: new Date(),
      })
      .exec();
  }

  async resetPassword(id: Types.ObjectId) {
    const newPassword = 'password';
    const hashedPassword = await argon2.hash(newPassword);
    await this.userModel
      .findByIdAndUpdate(id, {
        password: hashedPassword,
      })
      .exec();
    return newPassword;
  }
}
