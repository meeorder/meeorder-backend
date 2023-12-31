import { UserRole, UserSchema } from '@/schema/users.schema';
import { CreateUserDto } from '@/users/dto/user.create.dto';
import { UpdateInfoDto } from '@/users/dto/user.update.info.dto';
import { UpdateRoleDto } from '@/users/dto/user.update.role.dto';
import { BadRequestException, Injectable } from '@nestjs/common';
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
    try {
      const createdUser = await this.userModel.create({
        username: createUserDto.username,
        password: hashedPassword,
        role: createUserDto.role,
      });
      return createdUser;
    } catch (err) {
      const duplicateErrorCode = 11000;
      if (err.code === duplicateErrorCode) {
        throw new BadRequestException({
          message: 'ชื่อผู้ใช้นี้ถูกใช้ไปแล้ว',
        });
      } else {
        throw err;
      }
    }
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
      .updateOne({ _id: id }, { deleted_at: new Date() })
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

  async updateRole(id: Types.ObjectId, updateRole: UpdateRoleDto) {
    await this.userModel
      .updateOne(
        { _id: id },
        {
          role: updateRole.role,
        },
      )
      .exec();
  }

  async updateUserInfo(userId: Types.ObjectId, updateInfo: UpdateInfoDto) {
    const user = await this.userModel
      .findOne({ _id: userId }, { username: true, password: true })
      .exec();
    if (await argon2.verify(user.password, updateInfo.oldPassword)) {
      if (updateInfo.newUsername) {
        const isExist = await this.userModel
          .findOne({ username: updateInfo.newUsername })
          .exec();
        if (isExist) {
          throw new BadRequestException({
            message: 'ชื่อผู้ใช้นี้ถูกใช้ไปแล้ว',
          });
        }
        user.username = updateInfo.newUsername;
      }
      if (updateInfo.newPassword) {
        user.password = await argon2.hash(updateInfo.newPassword);
      }
      await this.userModel
        .updateOne(
          { _id: userId },
          {
            username: user.username,
            password: user.password,
          },
        )
        .exec();
    } else {
      throw new BadRequestException({
        message: 'รหัสผ่านไม่ถูกต้อง',
      });
    }
  }

  updateUserPoint(userId: Types.ObjectId, point: number) {
    return this.userModel
      .updateOne(
        {
          _id: userId,
          deleted_at: null,
        },
        {
          $inc: {
            point,
          },
        },
      )
      .exec();
  }
}
