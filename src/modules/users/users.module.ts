import { Module } from '@nestjs/common';
import { UserService } from './users.service';
import UserController from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from './entities/users.entities';
import { UsersRepository } from './users.repositories';

@Module({
  imports: [TypeOrmModule.forFeature([Users])],
  providers: [UserService, UsersRepository],
  controllers: [UserController],
})
export class UsersModule {}
