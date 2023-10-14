import { DashboardService } from '@/dashboard/dashboard.service';
import { GetReceiptAmountDto } from '@/dashboard/dto/getAllReceiptAmount.dto';
import { GetCouponReportTodayDto } from '@/dashboard/dto/getCouponReportToday.dto';
import { GetCouponReportTotalDto } from '@/dashboard/dto/getCouponReportTotal.dto';
import { GetIncomePerReceiptDto } from '@/dashboard/dto/getIncomeReportPerReceipt.dto';
import { GetNetIncomeDto } from '@/dashboard/dto/getNetIncom.dto';
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
    description: 'Total receipt amount Today',
  })
  @ApiOperation({
    summary: 'Get total receipt amount Today',
  })
  @ApiQuery({
    name: 'date',
    type: Number,
    required: true,
    description: 'Start Date (UnixTimeStamp in seconds)',
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
    description: 'Net income & Discount Today',
  })
  @ApiOperation({
    summary: 'Get net income & discount Today',
  })
  @Get('/incomes_report')
  @HttpCode(HttpStatus.OK)
  @Role(UserRole.Owner)
  @ApiQuery({
    name: 'date',
    type: Number,
    required: true,
    description: 'Start Date (UnixTimeStamp in seconds)',
  })
  async getIncomeReport(@Query('date') date: number) {
    return await this.dashboardService.getIncomeReport(
      new ParseMongoDatePipe().transform(date),
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
  @ApiQuery({
    name: 'date',
    type: Number,
    required: true,
    description: 'Start Date (UnixTimeStamp in seconds)',
  })
  async getCouponReportToday(@Query('date') date: number) {
    return await this.dashboardService.getCouponReportToday(
      new ParseMongoDatePipe().transform(date),
    );
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

  @ApiResponse({
    status: HttpStatus.OK,
    type: () => GetIncomePerReceiptDto,
    description: 'Total Coupon usage today',
  })
  @ApiOperation({
    summary: 'Get income per receipt Today',
  })
  @ApiQuery({
    name: 'date',
    type: Number,
    required: true,
    description: 'Start Date (UnixTimeStamp in seconds)',
  })
  @Get('/income_per_receipt')
  async getIncomePerReceipt(@Query('date') date: number) {
    return await this.dashboardService.getIncomeReportPerReceipt(
      new ParseMongoDatePipe().transform(date),
    );
  }
}
