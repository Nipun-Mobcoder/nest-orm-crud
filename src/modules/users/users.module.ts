import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard } from '@nestjs/throttler';

import { UserService } from './users.service';
import UserController from './users.controller';
import { Users } from './entities/users.entities';
import { UsersRepository } from './users.repositories';
import { RolesModule } from '../roles/roles.module';
import { RedisModule } from 'src/redis/redis.module';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([Users]), RolesModule, RedisModule],
  providers: [
    UserService,
    UsersRepository,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
  controllers: [UserController],
  exports: [UsersRepository],
})
export class UsersModule {}
