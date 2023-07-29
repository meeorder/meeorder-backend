import { SessionSchema } from '@/schema/session.schema';
import { Module } from '@nestjs/common';
import { TypegooseModule } from 'nest-typegoose';
import { SessionService } from './session.service';

@Module({
  imports: [TypegooseModule.forFeature([SessionSchema])],
  providers: [SessionService],
})
export class SessionModule {}
