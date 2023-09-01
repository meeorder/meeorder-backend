import { UserSchema } from '@/schema/users.schema';
import { UsersModule } from '@/users/users.module';
import { Module } from '@nestjs/common';
import { TypegooseModule } from 'nest-typegoose';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  imports: [UsersModule, TypegooseModule.forFeature([UserSchema])],
  providers: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
