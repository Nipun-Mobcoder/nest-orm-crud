import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard } from '@nestjs/throttler';

import { ProductsController } from './products.controller';
import { Products } from './entities/products.entities';
import { RedisModule } from 'src/redis/redis.module';
import { MicroServiceModule } from 'src/microservice/microservice.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Products]),
    RedisModule,
    MicroServiceModule,
  ],
  controllers: [ProductsController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class ProductsModule {}
