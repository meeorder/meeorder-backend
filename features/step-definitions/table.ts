import { TablesSchema } from '@/schema/tables.schema';
import { DataTable } from '@cucumber/cucumber';
import { ReturnModelType } from '@typegoose/typegoose';
import { after, binding, given } from 'cucumber-tsflow';
import { Workspace } from 'features/step-definitions/workspace';

@binding([Workspace])
export class TableStep {
  private readonly tableModel: ReturnModelType<typeof TablesSchema>;

  constructor(private readonly workspace: Workspace) {
    this.tableModel = this.workspace.datasource.getModel(TablesSchema);
  }

  @given('tables')
  async createTable(dt: DataTable) {
    const tables = dt.hashes();
    await this.tableModel.create(tables);
  }

  @after()
  async clearDb() {
    await this.tableModel.deleteMany({});
  }
}
