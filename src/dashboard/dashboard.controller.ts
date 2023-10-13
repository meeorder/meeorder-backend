import { DashboardService } from '@/dashboard/dashboard.service';
import { GetReceiptAmountDto } from '@/dashboard/dto/getAllReceiptAmount.dto';
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
}
