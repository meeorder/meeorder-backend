import { DashboardService } from '@/dashboard/dashboard.service';
import { ChartDataDailyDto } from '@/dashboard/dto/chartData.daily.dto';
import { ChartDataMonthlyDto } from '@/dashboard/dto/chartData.monthly.dto';
import { ChartDataYearlyDto } from '@/dashboard/dto/chartData.yearly.dto';
import { ChartGroupResponseDto } from '@/dashboard/dto/chartGroup.dto';
import { GetReceiptAmountDto } from '@/dashboard/dto/getAllReceiptAmount.dto';
import { GetCouponReportTodayDto } from '@/dashboard/dto/getCouponReportToday.dto';
import { GetCouponReportTotalDto } from '@/dashboard/dto/getCouponReportTotal.dto';
import { GetNetIncomeDto } from '@/dashboard/dto/getNetIncom.dto';
import { SaleReportDto } from '@/dashboard/dto/salesReport.dto';
import { Role } from '@/decorator/roles.decorator';
import { ParseMongoDatePipe } from '@/pipes/mongo-date.pipe';
import { UserRole } from '@/schema/users.schema';
import { Controller, Get, HttpCode, HttpStatus, Query } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
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
    type: () => GetReceiptAmountDto,
    description: 'Total receipt amount',
  })
  @ApiOperation({
    summary: 'Get total receipt amount',
  })
  @ApiQuery({
    name: 'date',
    type: Number,
    required: true,
    description: 'Date (UnixTimeStamp in seconds)',
  })
  @Get('/receipt_report')
  @HttpCode(HttpStatus.OK)
  @Role(UserRole.Owner)
  async getReceiptReport(@Query('date') date: number) {
    return await this.dashboardService.getAllReceiptAmount(
      new ParseMongoDatePipe().transform(date),
    );
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
    description: 'Start Date (UnixTimeStamp in seconds)',
  })
  @ApiQuery({
    name: 'end',
    type: Number,
    required: true,
    description: 'End Date (UnixTimeStamp in seconds)',
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

  @ApiResponse({
    status: HttpStatus.OK,
    type: () => ChartDataDailyDto,
    description: 'All daily net income',
  })
  @ApiOperation({
    summary: 'Get all daily net income',
  })
  @Get('/net_income/chart_data/daily')
  @HttpCode(HttpStatus.OK)
  @Role(UserRole.Owner)
  async getDailyNetIncome() {
    return await this.dashboardService.getAllDailyNetIncome();
  }

  @ApiResponse({
    status: HttpStatus.OK,
    type: () => ChartDataMonthlyDto,
    description: 'All monthly net income',
  })
  @ApiOperation({
    summary: 'Get all monthly net income',
  })
  @Get('/net_income/chart_data/monthly')
  @HttpCode(HttpStatus.OK)
  @Role(UserRole.Owner)
  async getMonthlyNetIncome() {
    return await this.dashboardService.getAllMonthlyNetIncome();
  }

  @ApiResponse({
    status: HttpStatus.OK,
    type: () => ChartDataYearlyDto,
    description: 'All yearly net income',
  })
  @ApiOperation({
    summary: 'Get all yearly net income',
  })
  @Get('/net_income/chart_data/yearly')
  @HttpCode(HttpStatus.OK)
  @Role(UserRole.Owner)
  async getYearlyNetIncome() {
    return await this.dashboardService.getAllYearlyNetIncome();
  }

  @ApiResponse({
    status: HttpStatus.OK,
    type: () => ChartGroupResponseDto,
    description:
      'Report net income grouped by hour, day of week, month, quarter',
  })
  @ApiOperation({
    summary:
      'Get report net income grouped by hour, day of week, month, quarter',
  })
  @Get('/net_income/chart_group')
  @HttpCode(HttpStatus.OK)
  @Role(UserRole.Owner)
  @ApiQuery({
    name: 'startTime',
    type: Number,
    required: true,
    description: 'Start Date (UnixTimeStamp in seconds)',
  })
  @ApiQuery({
    name: 'endTime',
    type: Number,
    required: true,
    description: 'End Date (UnixTimeStamp in seconds)',
  })
  async getAllGroupedNetIncome(
    @Query('startTime') startTime: number,
    @Query('endTime') endTime: number,
  ) {
    const allGroupedNetIncome = new ChartGroupResponseDto();

    allGroupedNetIncome.hourly =
      await this.dashboardService.getHourGroupedNetIncome(
        new ParseMongoDatePipe().transform(startTime),
        new ParseMongoDatePipe().transform(endTime),
      );

    allGroupedNetIncome.daysOfWeek =
      await this.dashboardService.getDayGroupedNetIncome(
        new ParseMongoDatePipe().transform(startTime),
        new ParseMongoDatePipe().transform(endTime),
      );

    allGroupedNetIncome.monthly =
      await this.dashboardService.getMonthGroupedNetIncome(
        new ParseMongoDatePipe().transform(startTime),
        new ParseMongoDatePipe().transform(endTime),
      );

    allGroupedNetIncome.quarterly =
      await this.dashboardService.getQuarterGroupedNetIncome(
        new ParseMongoDatePipe().transform(startTime),
        new ParseMongoDatePipe().transform(endTime),
      );

    return allGroupedNetIncome;
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

  @ApiOperation({
    summary: 'Get all sales report from start date to end date',
  })
  @Get('/sales_report')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    type: () => SaleReportDto,
    isArray: true,
    description: 'Sales report from start date to end date',
  })
  async getSaleReports(
    @Query('startTime') startTime: number,
    @Query('endTime') endTime: number,
  ) {
    return await this.dashboardService.getSalesReport(
      new ParseMongoDatePipe().transform(startTime),
      new ParseMongoDatePipe().transform(endTime),
    );
  }
}
