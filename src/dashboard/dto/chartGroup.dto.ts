import { DaysOfWeekSubDto } from '@/dashboard/dto/daysOfWeek.sub.dto';
import { HourlySubDto } from '@/dashboard/dto/hourly.sub.dto';
import { MonthlySubDto } from '@/dashboard/dto/monthly.sub.dto';
import { QuarterlySubDto } from '@/dashboard/dto/quarterly.sub.dto';
import { ApiProperty } from '@nestjs/swagger';

export class ChartGroupResponseDto {
  @ApiProperty({
    description: 'Report net income grouped by hour',
    type: HourlySubDto,
  })
  hourly: HourlySubDto;

  @ApiProperty({
    description: 'Report net income grouped by day of week',
    type: DaysOfWeekSubDto,
  })
  daysOfWeek: DaysOfWeekSubDto;

  @ApiProperty({
    description: 'Report net income grouped by month',
    type: MonthlySubDto,
  })
  monthly: MonthlySubDto;

  @ApiProperty({
    description: 'Report net income grouped by quarter',
    type: QuarterlySubDto,
  })
  quarterly: QuarterlySubDto;
}
