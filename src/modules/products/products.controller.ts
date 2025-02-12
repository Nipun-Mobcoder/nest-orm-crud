import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthenticationGuard } from 'src/common/guard/authentication.guard';
import { Request } from 'express';
import { CreateProductsDto } from './dto/products.dto';
import { Permissions } from 'src/decorators/permissions.decorators';
import { Resource } from '../roles/enums/resource.enum';
import { Action } from '../roles/enums/action.enum';
import { AuthorizationGuard } from 'src/common/guard/authorization.guard';
import { ClientProxy } from '@nestjs/microservices';
import { InternalServerException } from 'src/common/exceptions/InternalServerException';
import { firstValueFrom } from 'rxjs';
import { ProductAlreadyExistsException } from 'src/common/exceptions/ProductlAlreadyExistsException';

@Controller('products')
@UseGuards(AuthenticationGuard, AuthorizationGuard)
export class ProductsController {
  constructor(
    @Inject('Redis_Client') private readonly redisClient: ClientProxy,
  ) {}

  @Get(':name')
  async getProduct(@Req() request: Request, @Param('name') name: string) {
    try {
      const users = request.user as { id: number; email: string };
      name = name.replaceAll('_', ' ');
      await this.redisClient.connect();
      const product = await firstValueFrom(
        this.redisClient.send({ cmd: 'FIND_PRODUCT' }, { id: users.id, name }),
      );
      if (!product) {
        throw new InternalServerException(
          `Product ${name} not found for user ${users.id}`,
        );
      }

      return product;
    } catch (error) {
      console.error('Microservice Error:', error);
      throw new InternalServerException(error.message || 'Microservice failed');
    }
  }

  @Get()
  @Permissions([{ resource: Resource.products, actions: [Action.read] }])
  async getProducts(@Req() request: Request) {
    try {
      const users = request.user as { id: number; email: string };
      const products = await firstValueFrom(
        this.redisClient.send({ cmd: 'FIND_ALL_PRODUCTS' }, { id: users.id }),
      );
      if (!products) {
        throw new ProductAlreadyExistsException('Any Product', users.email);
      }
      return products;
    } catch (error) {
      console.error('Microservice Error:', error);
      throw new InternalServerException(error.message || 'Microservice failed');
    }
  }

  @Post('create')
  @Permissions([{ resource: Resource.products, actions: [Action.create] }])
  async createProduct(
    @Req() request: Request,
    @Body() createProduct: CreateProductsDto,
  ) {
    try {
      const users = request.user as { id: number; email: string };
      const products = await firstValueFrom(
        this.redisClient.send(
          { cmd: 'CREATE_PRODUCT' },
          { createProduct, id: users.id },
        ),
      );
      if (!products) {
        throw new InternalServerException();
      }
      return products;
    } catch (error) {
      console.error('Microservice Error:', error);
      throw new InternalServerException(error.message || 'Microservice failed');
    }
  }
}
