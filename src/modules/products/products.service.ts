import { Injectable } from '@nestjs/common';
import { ProductRepositories } from './products.repositories';
import { Products } from './entities/products.entities';
import { InternalServerException } from 'src/common/exceptions/InternalServerException';
import { CreateProductsDto } from './dto/products.dto';
import { ProductAlreadyExistsException } from 'src/common/exceptions/ProductlAlreadyExistsException';

@Injectable()
export class ProductsService {
  constructor(private readonly productsRepositories: ProductRepositories) {}

  async getProduct(name: string, id: number): Promise<Products> {
    const product = await this.productsRepositories.findProduct(id, name);
    if (!product) {
      throw new InternalServerException(
        `Product ${name} not found for user ${id}`,
      );
    }

    return product;
  }

  async getProducts(id: number): Promise<Products[]> {
    const products = await this.productsRepositories.findProducts(id);
    if (!products) {
      throw new InternalServerException();
    }
    return products;
  }

  async createProduct(
    id: number,
    createProduct: CreateProductsDto,
  ): Promise<Products> {
    const product = await this.productsRepositories.findProduct(
      id,
      createProduct.name,
    );
    if (product) {
      throw new ProductAlreadyExistsException(product.name, product.user.email);
    }

    return this.productsRepositories.create(createProduct, id);
  }
}
