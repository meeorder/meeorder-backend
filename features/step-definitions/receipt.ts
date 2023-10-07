import { ReceiptSchema } from '@/schema/receipt.schema';
import { DataTable } from '@cucumber/cucumber';
import { ReturnModelType } from '@typegoose/typegoose';
import { after, binding, given } from 'cucumber-tsflow';
import { Workspace } from 'features/step-definitions/workspace';
import { Types } from 'mongoose';

@binding([Workspace])
export class ReceiptSteps {
  private readonly receiptModel: ReturnModelType<typeof ReceiptSchema>;
  constructor(private readonly workspace: Workspace) {
    this.receiptModel = this.workspace.datasource.getModel(ReceiptSchema);
  }

  reciept_menus_dummy = [new Types.ObjectId('6520b0688a25812234451791')];
  recipt_session_dummy = new Types.ObjectId('6520b06cd9bb075330ce1c08');

  @given('receipts')
  async givenReceipts(dt: DataTable) {
    const receipts = dt.hashes();
    for (const receipt of receipts) {
      await this.receiptModel.create({
        _id: receipt._id,
        total_price: receipt.total_price,
        discount_price: receipt.discount_price,
        created_at: receipt.created_at
          ? new Date(receipt.created_at)
          : new Date(),
        deleted_at: receipt.deleted_at
          ? new Date(receipt.deleted_at)
          : new Date(),
        menus: receipt.menus ? receipt.menus : this.reciept_menus_dummy,
        session: receipt.session ? receipt.session : this.recipt_session_dummy,
      });
    }
  }

  @after()
  async clearReceipts() {
    await this.receiptModel.deleteMany({});
  }
}
