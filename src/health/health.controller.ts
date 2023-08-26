import { Controller, Get, HttpStatus } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

@Controller('health')
@ApiTags('health')
export class HealthController {
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
