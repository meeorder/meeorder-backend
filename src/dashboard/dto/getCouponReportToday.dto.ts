import { ApiProperty } from '@nestjs/swagger';

export class GetCouponReportTodayDto {
  @ApiProperty({
    description: 'Total used coupon today',
    type: Number,
  })
  couponUsageToday: number;
}
