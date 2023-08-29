import { HealthSchema } from '@/schema/health.schema';
import { Module } from '@nestjs/common';
import { TypegooseModule } from 'nest-typegoose';
import { HealthController } from './health.controller';

@Module({
  imports: [TypegooseModule.forFeature([HealthSchema])],
  controllers: [HealthController],
})
export class HealthModule {}
