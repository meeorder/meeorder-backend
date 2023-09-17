import { UserRole, UserSchema } from '@/schema/users.schema';
import { DataTable } from '@cucumber/cucumber';
import { ReturnModelType } from '@typegoose/typegoose';
import * as argon2 from 'argon2';
import { after, binding, given, when } from 'cucumber-tsflow';
import { Workspace } from 'features/step-definitions/workspace';
import { Types } from 'mongoose';

@binding([Workspace])
export class UserSteps {
  private readonly userModel: ReturnModelType<typeof UserSchema>;

  private hashPassword(password: string): Promise<string> {
    return argon2.hash(password);
  }

  constructor(private readonly workspace: Workspace) {
    this.userModel = this.workspace.datasource.getModel(UserSchema);
  }

  @given('users')
  async givenUsers(dt: DataTable) {
    const users = dt.hashes();
    for (const user of users) {
      await this.userModel.create({
        _id: new Types.ObjectId(user._id),
        username: user.username,
        password: await this.hashPassword(user.password),
        role: user.role ? +user.role : UserRole.Owner,
        point: user.point ? +user.point : 0,
      });
    }
  }

  @when('create a user')
  async createUser(dt: DataTable) {
    const req = dt.hashes()[0];
    this.workspace.response = await this.workspace.axiosInstance.post(
      '/users',
      {
        username: req.username,
        password: req.password,
        role: req.role,
      },
    );
  }

  @when('update user role')
  async updateUserRole(dt: DataTable) {
    const req = dt.hashes()[0];
    this.workspace.response = await this.workspace.axiosInstance.patch(
      `/users/${req._id}/role`,
      {
        role: req.role,
      },
    );
  }

  @when('update user info')
  async updateUserInfo(dt: DataTable) {
    const req = dt.hashes()[0];
    this.workspace.response = await this.workspace.axiosInstance.patch(
      `/users`,
      {
        newUsername: req.newUsername,
        oldPassword: req.oldPassword,
        newPassword: req.newPassword,
      },
    );
  }

  @after()
  async clearDb() {
    await this.userModel.deleteMany({});
  }
}
