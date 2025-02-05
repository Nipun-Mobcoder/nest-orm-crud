import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { RolesService } from './roles.service';
import { RolesController } from './roles.controller';
import { Permission, Roles } from './entities/roles.entities';
import { RolesRepository } from './roles.repositories';

@Module({
  imports: [TypeOrmModule.forFeature([Roles, Permission])],
  controllers: [RolesController],
  providers: [RolesService, RolesRepository],
})
export class RolesModule {}
