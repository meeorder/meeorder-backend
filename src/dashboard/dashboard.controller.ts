import { DashboardService } from '@/dashboard/dashboard.service';
import { GetUserAmountDto } from '@/dashboard/dto/getAllUserAmount.dto';
import { ParseMongoDatePipe } from '@/pipes/mongo-date.pipe';
import { Controller, Get, HttpStatus, Param } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@Controller({ path: 'dashboard', version: '1' })
@ApiTags('dashboard')
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
  @Get(':date')
  async getDashboard(@Param('date') date: number) {
    const parseDate = new ParseMongoDatePipe();
    return await this.dashboardService.getAllUserAmount(
      parseDate.transform(date),
    );
  }
}
