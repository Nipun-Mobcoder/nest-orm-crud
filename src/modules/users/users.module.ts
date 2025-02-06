import { Global, Module } from '@nestjs/common';
import { UserService } from './users.service';
import UserController from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from './entities/users.entities';
import { UsersRepository } from './users.repositories';
import { RolesModule } from '../roles/roles.module';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([Users]), RolesModule],
  providers: [UserService, UsersRepository],
  controllers: [UserController],
  exports: [UsersRepository],
})
export class UsersModule {}
