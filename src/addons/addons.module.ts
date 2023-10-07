import { AddonsController } from '@/addons/addons.controller';
import { LoggerModule } from '@/logger/logger.module';
import { AddonSchema } from '@/schema/addons.schema';
import { Module } from '@nestjs/common';
import { TypegooseModule } from 'nest-typegoose';
import { AddonsService } from './addons.service';

@Module({
  imports: [TypegooseModule.forFeature([AddonSchema]), LoggerModule],
  providers: [AddonsService],
  controllers: [AddonsController],
  exports: [AddonsService],
})
export class AddonsModule {}
