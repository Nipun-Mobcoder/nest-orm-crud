import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { ProductRepositories } from './products.repositories';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Products } from './entities/products.entities';

@Module({
  imports: [TypeOrmModule.forFeature([Products])],
  controllers: [ProductsController],
  providers: [ProductsService, ProductRepositories],
})
export class ProductsModule {}
