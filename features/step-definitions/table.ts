import { SessionSchema } from '@/schema/session.schema';
import { TablesSchema } from '@/schema/tables.schema';
import { TableResponseDto } from '@/tables/dto/table.response.dto';
import { DataTable } from '@cucumber/cucumber';
import { HttpStatus } from '@nestjs/common';
import { ReturnModelType } from '@typegoose/typegoose';
import { after, binding, given, then, when } from 'cucumber-tsflow';
import expect from 'expect';
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

  @when('get table by id {string}')
  async getTableById(id: string) {
    this.workspace.response = await this.workspace.axiosInstance.get(
      `/tables/${id}`,
    );
    expect(this.workspace.response.status).toBe(HttpStatus.OK);
  }

  @then('table session id will be {string}')
  thenTableSessionId(id: string) {
    expect(
      (<SessionSchema>(<TableResponseDto>this.workspace.response.data).session)
        ._id,
    ).toBe(id);
  }

  @after()
  async clearDb() {
    await this.tableModel.deleteMany({});
  }
}
