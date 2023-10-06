import { DashboardService } from '@/dashboard/dashboard.service';
import { ChartDataDailyDto } from '@/dashboard/dto/chartData.daily.dto';
import { ChartDataMonthlyDto } from '@/dashboard/dto/chartData.monthly.dto';
import { ChartDataYearlyDto } from '@/dashboard/dto/chartData.yearly.dto';
import { ChartGroupResponseDto } from '@/dashboard/dto/chartGroup.dto';
import { GetUserAmountDto } from '@/dashboard/dto/getAllUserAmount.dto';
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
  @Get('/customer_report/:date')
  @HttpCode(HttpStatus.OK)
  @Role(UserRole.Owner)
  async getDashboard(@Param('date') date: number) {
    return await this.dashboardService.getAllUserAmount(
      new ParseMongoDatePipe().transform(date),
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
}
