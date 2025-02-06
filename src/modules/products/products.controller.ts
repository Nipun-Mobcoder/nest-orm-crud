import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { AuthenticationGuard } from 'src/common/guard/authentication.guard';
import { Request } from 'express';
import { CreateProductsDto } from './dto/products.dto';
import { Permissions } from 'src/decorators/permissions.decorators';
import { Resource } from '../roles/enums/resource.enum';
import { Action } from '../roles/enums/action.enum';
import { AuthorizationGuard } from 'src/common/guard/authorization.guard';

@Controller('products')
@UseGuards(AuthenticationGuard)
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get(':name')
  getProduct(@Req() request: Request, @Param('name') name: string) {
    const users = request.user as { id: number; email: string };
    name = name.replaceAll('_', ' ');
    return this.productsService.getProduct(name, users.id);
  }

  @Get()
  @UseGuards(AuthorizationGuard)
  @Permissions([{ resource: Resource.products, actions: [Action.read] }])
  getProducts(@Req() request: Request) {
    const users = request.user as { id: number; email: string };
    return this.productsService.getProducts(users.id);
  }

  @Post('create')
  @Permissions([{ resource: Resource.products, actions: [Action.create] }])
  createProduct(
    @Req() request: Request,
    @Body() createProduct: CreateProductsDto,
  ) {
    const users = request.user as { id: number; email: string };
    return this.productsService.createProduct(users.id, createProduct);
  }
}
