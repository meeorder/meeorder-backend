import { Controller, Get, HttpStatus } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { HealthResponseDto } from './dto/health.response.dto';

@Controller('health')
@ApiTags('health')
export class HealthController {
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Health status',
    type: () => HealthResponseDto,
  })
  @Get()
  getHealth(): HealthResponseDto {
    return new HealthResponseDto('OK');
  }
}
