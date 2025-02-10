import { Injectable, Logger } from '@nestjs/common';
import { EntityManager, Repository } from 'typeorm';
import { CreateUserDto } from './dto/createUser.dto';
import { Users } from './entities/users.entities';
import { InjectRepository } from '@nestjs/typeorm';
import * as jwt from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';
import { InternalServerException } from 'src/common/exceptions/InternalServerException';
import { RolesRepository } from '../roles/roles.repositories';
import { UserNotFoundException } from 'src/common/exceptions/UserNotFoundException';

@Injectable()
export class UsersRepository {
  private readonly logger = new Logger(UsersRepository.name);
  constructor(
    @InjectRepository(Users)
    private readonly userRepository: Repository<Users>,
    private readonly entityManager: EntityManager,
    private readonly configService: ConfigService,
    private readonly rolesRepository: RolesRepository,
  ) {}

  async create(createUser: CreateUserDto): Promise<Users> {
    try {
      const user = new Users(createUser);
      const data = await this.entityManager.save(user);
      return data;
    } catch (e) {
      this.logger.error(e);
      throw new InternalServerException(e?.message);
    }
  }

  async findUser(email: string): Promise<Users | null> {
    try {
      return await this.userRepository.findOne({
        where: {
          email,
        },
        select: {
          email: true,
          password: true,
          id: true,
        },
      });
    } catch (e) {
      this.logger.error(e);
      throw new InternalServerException(e?.message);
    }
  }

  createToken = (user: Users): string => {
    try {
      const secret = this.configService.get<string>('JWT_SECRET');
      if (!secret) {
        throw new InternalServerException(
          'JWT_SECRET is not defined in environment variables.',
        );
      }
      const token = jwt.sign({ id: user.id, email: user.email }, secret, {
        expiresIn: '1h',
      });

      return token;
    } catch (e) {
      this.logger.error(e);
      throw new InternalServerException(e?.message);
    }
  };

  async fetchUser(email: string): Promise<Users | null> {
    try {
      return await this.userRepository.findOne({
        where: {
          email,
        },
      });
    } catch (e) {
      this.logger.error(e);
      throw new InternalServerException(e?.message);
    }
  }

  async assignRole(email: string, roleName: string): Promise<Users | null> {
    try {
      const role = await this.rolesRepository.findRole(roleName);
      if (!role) {
        throw new UserNotFoundException(roleName);
      }

      const user = await this.userRepository.findOneBy({ email });
      if (!user) {
        throw new UserNotFoundException(email);
      }

      if (!user.roles) {
        user.roles = [];
      }
      user.roles.push(role);
      return await this.entityManager.save(user);
    } catch (e) {
      throw new InternalServerException(e?.message);
    }
  }

  async fetchUserPermissions(userId: number): Promise<any> {
    const userDetails = await this.userRepository.findOne({
      where: {
        id: userId,
      },
      relations: ['roles'],
    });
    return userDetails?.roles;
  }
}
