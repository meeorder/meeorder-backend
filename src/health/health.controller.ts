import { UserJwt } from '@/auth/user.jwt.payload';
import { User } from '@/decorator/user.decorator';
import { HealthResponseDto } from '@/health/dto/health.response.dto';
import { Controller, Get, HttpStatus } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

@Controller('health')
@ApiTags('health')
export class HealthController {
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Health status',
    type: () => HealthResponseDto,
  })
  @Get('/ping')
  getPing(@User() user: UserJwt) {
    return {
      msg: 'pong',
      user,
    };
  }
}
