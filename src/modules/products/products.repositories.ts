import { Injectable, Logger } from '@nestjs/common';
import { EntityManager, Equal, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { InternalServerException } from 'src/common/exceptions/InternalServerException';
import { Products } from './entities/products.entities';
import { CreateProductsDto } from './dto/products.dto';
import { Users } from '../users/entities/users.entities';
import { UserNotFoundException } from 'src/common/exceptions/UserNotFoundException';

@Injectable()
export class ProductRepositories {
  private readonly logger = new Logger(ProductRepositories.name);
  constructor(
    @InjectRepository(Products)
    private readonly productRepository: Repository<Products>,
    private readonly entityManager: EntityManager,
  ) {}

  async create(
    createProduct: CreateProductsDto,
    userId: number,
  ): Promise<Products> {
    try {
      const user = await this.entityManager.findOne(Users, {
        where: { id: userId },
      });
      if (!user) {
        throw new UserNotFoundException(userId.toString());
      }
      const product = new Products({ ...createProduct, user });
      return await this.entityManager.save(product);
    } catch (e) {
      this.logger.error(e);
      throw new InternalServerException();
    }
  }

  async findProducts(id: number): Promise<Products[] | null> {
    try {
      return await this.productRepository.find({
        where: {
          user: Equal(id),
        },
      });
    } catch (e) {
      this.logger.error(e);
      throw new InternalServerException();
    }
  }

  async findProduct(id: number, productName: string): Promise<Products | null> {
    try {
      return await this.productRepository.findOne({
        where: {
          user: Equal(id),
          name: productName,
        },
      });
    } catch (e) {
      this.logger.error(e);
      throw new InternalServerException();
    }
  }
}
