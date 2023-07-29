import { SessionSchema } from '@/schema/session.schema';
import { Module } from '@nestjs/common';
import { TypegooseModule } from 'nest-typegoose';
import { SessionService } from './session.service';
import { SessionController } from './session.controller';

@Module({
  imports: [TypegooseModule.forFeature([SessionSchema])],
  providers: [SessionService],
  controllers: [SessionController],
})
export class SessionModule {}
