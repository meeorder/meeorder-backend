import { ApiProperty } from '@nestjs/swagger';

export class GetCouponReportTotalDto {
  @ApiProperty({
    description: 'Total coupon',
    type: Number,
  })
  couponQuota: number;

  @ApiProperty({
    description: 'Total used coupon',
    type: Number,
  })
  couponUsageTotal: number;
}
