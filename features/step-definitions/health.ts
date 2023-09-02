import { binding, when } from 'cucumber-tsflow';
import { Workspace } from 'features/step-definitions/workspace';

@binding([Workspace])
export class HealthTest {
  constructor(private readonly workspace: Workspace) {}

  @when('called health check')
  async healthCheck() {
    this.workspace.response = await this.workspace
      .getAxiosInstance()
      .get('/health/ping');
  }
}
