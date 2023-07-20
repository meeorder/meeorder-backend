import { Module } from '@nestjs/common';
import { HealthService } from './health.service';
import { HealthController } from './health.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { HealthClass, HealthSchema } from '@/schema/health.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: HealthClass.name, schema: HealthSchema },
    ]),
  ],
  providers: [HealthService],
  controllers: [HealthController],
})
export class HealthModule {}
