import { TablesSchema } from '@/schema/tables.schema';
import { DataTable } from '@cucumber/cucumber';
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

  @when('get all tables')
  async getAllTables() {
    this.workspace.response = await this.workspace.axiosInstance.get('/tables');
  }

  @then('table total price should be {int}')
  tableTotalPriceShouldBe(totalPrice: number) {
    const { data } = this.workspace.response;
    expect(data[0].totalPrice).toBe(totalPrice);
  }

  @then('table allOrdersCount should be {int}')
  tableAllOrdersCountShouldBe(allOrdersCount: number) {
    const { data } = this.workspace.response;
    expect(data[0].allOrdersCount).toBe(allOrdersCount);
  }

  @then('table unfinishOrdersCount should be {int}')
  tableUnfinishOrdersCountShouldBe(unfinishOrdersCount: number) {
    const { data } = this.workspace.response;
    expect(data[0].unfinishOrdersCount).toBe(unfinishOrdersCount);
  }

  @after()
  async clearDb() {
    await this.tableModel.deleteMany({});
  }
}
