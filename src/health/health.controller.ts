import { Controller, Get, HttpStatus } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { HealthResponseDto } from './dto/health.response.dto';
import { HealthService } from './health.service';

@Controller('health')
@ApiTags('health')
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Health status',
    type: () => HealthResponseDto,
  })
  @Get()
  async getHealth(): Promise<HealthResponseDto> {
    const doc = await this.healthService.createRecord();
    return new HealthResponseDto(doc);
  }

  @ApiResponse({
    type: String,
    status: HttpStatus.OK,
    description: 'Health status (Not connected to DB)',
  })
  @Get('/ping')
  getPing(): string {
    return 'pong';
  }
}
