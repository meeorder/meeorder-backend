import { UserRole, UserSchema } from '@/schema/users.schema';
import { DataTable } from '@cucumber/cucumber';
import { ReturnModelType } from '@typegoose/typegoose';
import * as argon2 from 'argon2';
import { after, binding, given, then, when } from 'cucumber-tsflow';
import { Workspace } from 'features/step-definitions/workspace';
import { Types } from 'mongoose';

@binding([Workspace])
export class DashboardStepDefination {
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
        created_at: user.created_at ? new Date(user.created_at) : new Date(),
        deleted_at: user.deleted_at ? new Date(user.deleted_at) : null,
      });
    }
  }

  @when('Get dashboard with date {number}')
  async getDashboard(date: number) {
    this.workspace.response = await this.workspace.axiosInstance.get(
      '/dashboard/customer_report/' + date,
    );
  }

  @then('should get dashboard with total {number}, old {number}, new {number}')
  async shouldGetDashboard(total: number, old: number, new_user: number) {
    const { data } = await this.workspace.response;
    expect(data.total_user).toBe(total);
    expect(data.old_user).toBe(old);
    expect(data.new_user).toBe(new_user);
  }

  @after()
  async cleanUpDb() {
    await this.userModel.deleteMany({});
  }
}
