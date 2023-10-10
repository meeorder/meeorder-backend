import { binding, when } from 'cucumber-tsflow';
import { Workspace } from 'features/step-definitions/workspace';
@binding([Workspace])
export class DashboardSteps {
  constructor(private readonly workspace: Workspace) {}

  @when('get receipt report from {int}')
  async getCustomerReport(date: number) {
    this.workspace.response = await this.workspace.axiosInstance.get(
      `/dashboard/receipt_report`,
      {
        params: {
          date,
        },
      },
    );
  }

  @when('get income report from {int} to {int}')
  async getIncomeReport(from: number, end: number) {
    this.workspace.response = await this.workspace.axiosInstance.get(
      `/dashboard/incomes_report`,
      {
        params: {
          from,
          end,
        },
      },
    );
  }
}
