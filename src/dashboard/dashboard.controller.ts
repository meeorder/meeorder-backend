import { DashboardService } from '@/dashboard/dashboard.service';
import { GetUserAmountDto } from '@/dashboard/dto/getAllUserAmount.dto';
import { Role } from '@/decorator/roles.decorator';
import { ParseMongoDatePipe } from '@/pipes/mongo-date.pipe';
import { UserRole } from '@/schema/users.schema';
import { Controller, Get, HttpCode, HttpStatus, Param } from '@nestjs/common';
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
}
