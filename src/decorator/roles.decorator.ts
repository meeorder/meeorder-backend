import { UserRole } from '@/schema/users.schema';
import { Reflector } from '@nestjs/core';

export const Role = Reflector.createDecorator<UserRole>();
