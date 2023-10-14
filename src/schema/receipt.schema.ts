import { ReceiptCouponSchema } from '@/schema/receipt.coupon.schema';
import { ReceiptMenuSchema } from '@/schema/receipt.menu.schema';
import { SessionSchema } from '@/schema/session.schema';
import { ApiProperty } from '@nestjs/swagger';
import { Ref, index, modelOptions, prop } from '@typegoose/typegoose';

@modelOptions({
  schemaOptions: {
    collection: 'receipts',
    timestamps: {
      createdAt: 'created_at',
    },
  },
})
@index({ session: 1 })
export class ReceiptSchema {
  @prop({ required: true, ref: () => SessionSchema })
  @ApiProperty({ type: String })
  session: Ref<SessionSchema>;

  @prop({
    required: true,
    type: () => [ReceiptMenuSchema],
  })
  @ApiProperty({ type: () => ReceiptMenuSchema, isArray: true })
  menus: ReceiptMenuSchema[];

  @prop({ default: null, type: () => ReceiptCouponSchema })
  @ApiProperty({ type: () => ReceiptCouponSchema })
  coupon: ReceiptCouponSchema;

  @prop()
  @ApiProperty()
  total_price: number;

  @prop()
  @ApiProperty()
  discount_price: number;

  @ApiProperty()
  get net_price(): number {
    return this.total_price - this.discount_price;
  }

  @prop({ default: 0 })
  @ApiProperty()
  received_point: number;

  @ApiProperty()
  created_at: Date;
}
