import { Injectable, Logger } from '@nestjs/common';
import { EntityManager, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import * as jwt from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';
import { InternalServerException } from 'src/common/exceptions/InternalServerException';
import { CreateRoleDto } from './dto/roles.dto';
import { Permission, Roles } from './entities/roles.entities';
import { Users } from '../users/entities/users.entities';

@Injectable()
export class RolesRepository {
  private readonly logger = new Logger(RolesRepository.name);
  constructor(
    @InjectRepository(Roles)
    private readonly roleRepository: Repository<Roles>,
    private readonly entityManager: EntityManager,
    private readonly configService: ConfigService,
  ) {}

  async create(createRole: CreateRoleDto): Promise<Roles> {
    try {
            const role = new Roles({
              ...createRole,
              permissions: createRole.permissions.map((perm) => new Permission(perm)),
            });
            return await this.entityManager.save(role);
        } catch (e) {
      this.logger.error(e);
      throw new InternalServerException();
    }
  }

  async findRole(name: string): Promise<Roles | null> {
    try {
      return await this.roleRepository.findOneBy({
          name
      });
    } catch (e) {
      this.logger.error(e);
      throw new InternalServerException();
    }
  }

  fetchDetails = (token: string): Users => {
    try {
      const secret = this.configService.get<string>('JWT_SECRET');
      if (!secret) {
        throw new Error('JWT_SECRET is not defined in environment variables.');
      }
      return jwt.verify(token, secret) as Users;
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerException(error.message);
    }
  };
}
