import { HealthSchema } from '@/schema/health.schema';
import { Module } from '@nestjs/common';
import { TypegooseModule } from 'nest-typegoose';
import { HealthController } from './health.controller';
import { HealthService } from './health.service';

@Module({
  imports: [TypegooseModule.forFeature([HealthSchema])],
  providers: [HealthService],
  controllers: [HealthController],
})
export class HealthModule {}
