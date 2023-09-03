import { DataTable } from '@cucumber/cucumber';
import { binding, when } from 'cucumber-tsflow';
import { Workspace } from 'features/step-definitions/workspace';

@binding([Workspace])
export class UserSteps {
  constructor(private readonly workspace: Workspace) {}

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
}
