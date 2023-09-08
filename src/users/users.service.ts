import { UserRole, UserSchema } from '@/schema/users.schema';
import { CreateUserDto } from '@/users/dto/user.create.dto';
import { Injectable } from '@nestjs/common';
import { DocumentType, ReturnModelType } from '@typegoose/typegoose';
import * as argon2 from 'argon2';
import { Types } from 'mongoose';
import { InjectModel } from 'nest-typegoose';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(UserSchema)
    private readonly userModel: ReturnModelType<typeof UserSchema>,
  ) {}

  async createUser(
    createUserDto: CreateUserDto,
  ): Promise<DocumentType<UserSchema>> {
    const hashedPassword = await argon2.hash(createUserDto.password);
    const createdUser = await this.userModel.create({
      username: createUserDto.username,
      password: hashedPassword,
      role: createUserDto.role,
    });
    return createdUser;
  }

  async getUserByUsername(username: string) {
    return await this.userModel
      .findOne({ username })
      .select('+password')
      .exec();
  }

  getUserById(id: Types.ObjectId) {
    return this.userModel.findById(id).exec();
  }

  async getUsers(role: string = undefined) {
    if (!role) {
      return await this.userModel.find({ deleted_at: null }).exec();
    }
    return await this.userModel
      .find({ role: UserRole[role], deleted_at: null })
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
    const newPassword = '123456';
    const hashedPassword = await argon2.hash(newPassword);
    await this.userModel
      .findByIdAndUpdate(id, {
        password: hashedPassword,
      })
      .exec();
  }
}
