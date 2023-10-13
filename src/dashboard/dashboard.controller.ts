import { DashboardService } from '@/dashboard/dashboard.service';
import { GetUserAmountDto } from '@/dashboard/dto/getAllUserAmount.dto';
import { GetCouponReportTodayDto } from '@/dashboard/dto/getCouponReportToday.dto';
import { GetCouponReportTotalDto } from '@/dashboard/dto/getCouponReportTotal.dto';
import { GetNetIncomeDto } from '@/dashboard/dto/getNetIncom.dto';
import { Role } from '@/decorator/roles.decorator';
import { ParseMongoDatePipe } from '@/pipes/mongo-date.pipe';
import { UserRole } from '@/schema/users.schema';
import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Query,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@Controller({ path: 'dashboard', version: '1' })
@ApiTags('dashboard')
@ApiBearerAuth()
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @ApiResponse({
    status: HttpStatus.OK,
    type: () => GetUserAmountDto,
    description: 'Total registered users',
  })
  @ApiOperation({
    summary: 'Get total registered users',
  })
  @ApiParam({ name: 'date', type: Number })
  @Get('/customer_report/:date')
  @HttpCode(HttpStatus.OK)
  @Role(UserRole.Owner)
  async getDashboard(@Param('date', new ParseMongoDatePipe()) date: Date) {
    return await this.dashboardService.getAllUserAmount(date);
  }

  @ApiResponse({
    status: HttpStatus.OK,
    type: () => GetNetIncomeDto,
    description: 'Net income & Discount in range date',
  })
  @ApiOperation({
    summary: 'Get net income & discount in range date',
  })
  @Get('/incomes_report')
  @HttpCode(HttpStatus.OK)
  @Role(UserRole.Owner)
  @ApiQuery({
    name: 'from',
    type: Number,
    required: true,
    description: 'Start Date (UnixTimeStamp)',
  })
  @ApiQuery({
    name: 'end',
    type: Number,
    required: true,
    description: 'End Date (UnixTimeStamp)',
  })
  async getIncomeReport(
    @Query('from') date_from: number,
    @Query('end') date_end: number,
  ) {
    return await this.dashboardService.getIncomeReport(
      new ParseMongoDatePipe().transform(date_from),
      new ParseMongoDatePipe().transform(date_end),
    );
  }

  @ApiOperation({
    summary: 'Get total coupon usage today',
  })
  @Get('/coupon_report/today')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    type: () => GetCouponReportTodayDto,
    description: 'Total Coupon usage today',
  })
  async getCouponReportToday() {
    return await this.dashboardService.getCouponReportToday();
  }

  @ApiOperation({
    summary: 'Get total coupon usage',
  })
  @Get('/coupon_report')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    type: () => GetCouponReportTotalDto,
    description: 'Total Coupon usage',
  })
  async geCouponReportTotal() {
    return await this.dashboardService.getCouponReportTotal();
  }
}
