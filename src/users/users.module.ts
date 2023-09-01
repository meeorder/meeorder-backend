import { UserSchema } from '@/schema/users.schema';
import { Module } from '@nestjs/common';
import { TypegooseModule } from 'nest-typegoose';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  imports: [TypegooseModule.forFeature([UserSchema])],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
