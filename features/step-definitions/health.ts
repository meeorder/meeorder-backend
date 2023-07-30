import { HealthSchema } from '@/schema/health.schema';
import { ReturnModelType } from '@typegoose/typegoose';
import { binding, given, when } from 'cucumber-tsflow';
import expect from 'expect';
import { Workspace } from 'features/step-definitions/workspace';

@binding([Workspace])
export class HealthTest {
  private readonly healthModel: ReturnModelType<typeof HealthSchema>;

  constructor(private readonly workspace: Workspace) {
    this.healthModel = this.workspace.datasource.getModel(HealthSchema);
  }

  @given('a health')
  async givenHealth() {
    const doc = await this.healthModel.create({});
    expect(doc._id).toBeDefined();
  }

  @when('called health check')
  async healthCheck() {
    this.workspace.response = await this.workspace.axiosInstance.get('/health');
  }
}
