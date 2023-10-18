import { CategorySchema } from '@/schema/categories.schema';
import { ApiProperty } from '@nestjs/swagger';
import { Ref, isDocument, prop } from '@typegoose/typegoose';
import { Types } from 'mongoose';

export class ReceiptCategoryMenuSchema
  implements Pick<CategorySchema, '_id' | 'title'>
{
  @prop()
  @ApiProperty({ type: String })
  _id: Types.ObjectId;

  @prop()
  @ApiProperty()
  title: string;

  static fromRef(category: Ref<CategorySchema>) {
    if (!isDocument(category)) {
      throw new Error('Category is not a document');
    }

    const receiptCategory = new ReceiptCategoryMenuSchema();
    receiptCategory._id = category._id;
    receiptCategory.title = category.title;

    return receiptCategory;
  }
}
