import { Injectable, Logger } from '@nestjs/common';
import { EntityManager, Repository } from 'typeorm';
import { CreateUserDto } from './dto/createUser.dto';
import { Users } from './entities/users.entities';
import { InjectRepository } from '@nestjs/typeorm';
import * as jwt from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';
import { InternalServerException } from 'src/common/exceptions/InternalServerException';

@Injectable()
export class UsersRepository {
  private readonly logger = new Logger(UsersRepository.name);
  constructor(
    @InjectRepository(Users)
    private readonly userRepository: Repository<Users>,
    private readonly entityManager: EntityManager,
    private readonly configService: ConfigService,
  ) {}

  async create(createUser: CreateUserDto): Promise<Users> {
    try {
      const user = new Users(createUser);
      const data = await this.entityManager.save(user);
      return data;
    } catch (e) {
      this.logger.error(e);
      throw new InternalServerException();
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
      throw new InternalServerException();
    }
  }

  createToken = (user: Users): string => {
    try {
      const secret = this.configService.get<string>('JWT_SECRET');
      if (!secret) {
        throw new Error('JWT_SECRET is not defined in environment variables.');
      }
      const token = jwt.sign({ id: user.id, email: user.email }, secret, {
        expiresIn: '1h',
      });

      return token;
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerException();
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
      throw new InternalServerException();
    }
  }
}
