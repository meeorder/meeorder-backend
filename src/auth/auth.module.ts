import { JwtConfigService } from '@/auth/config/jwt.config.service';
import { UsersModule } from '@/users/users.module';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TypegooseModule } from 'nest-typegoose';
import { UserSchema } from '@/schema/users.schema';

@Module({
  imports: [
    UsersModule,
    JwtModule.registerAsync({
      useClass: JwtConfigService,
      global: true,
    }),
    TypegooseModule.forFeature([UserSchema]),
  ],
  providers: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
