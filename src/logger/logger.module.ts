import { StatusLogSchema } from '@/schema/status.log.schema';
import { Module } from '@nestjs/common';
import { TypegooseModule } from 'nest-typegoose';
import { LoggerService } from './logger.service';

@Module({
  imports: [TypegooseModule.forFeature([StatusLogSchema])],
  providers: [LoggerService],
  exports: [LoggerService],
})
export class LoggerModule {}
