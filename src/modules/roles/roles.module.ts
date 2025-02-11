import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';

import { RolesService } from './roles.service';
import { RolesController } from './roles.controller';
import { Permission, Roles } from './entities/roles.entities';
import { RolesRepository } from './roles.repositories';
import { RedisModule } from 'src/redis/redis.module';

@Module({
  imports: [TypeOrmModule.forFeature([Roles, Permission]), RedisModule],
  controllers: [RolesController],
  providers: [
    RolesService,
    RolesRepository,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
  exports: [RolesRepository],
})
export class RolesModule {}
