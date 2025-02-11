import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard } from '@nestjs/throttler';

import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { ProductRepositories } from './products.repositories';
import { Products } from './entities/products.entities';
import { RedisModule } from 'src/redis/redis.module';

@Module({
  imports: [TypeOrmModule.forFeature([Products]), RedisModule],
  controllers: [ProductsController],
  providers: [
    ProductsService,
    ProductRepositories,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class ProductsModule {}
