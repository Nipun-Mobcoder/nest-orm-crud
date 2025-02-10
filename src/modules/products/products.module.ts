import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { ProductRepositories } from './products.repositories';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Products } from './entities/products.entities';
import { RedisModule } from 'src/redis/redis.module';

@Module({
  imports: [TypeOrmModule.forFeature([Products]), RedisModule],
  controllers: [ProductsController],
  providers: [ProductsService, ProductRepositories],
})
export class ProductsModule {}
