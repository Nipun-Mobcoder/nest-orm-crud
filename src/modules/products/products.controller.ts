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
import { AuthGuard } from 'src/common/guard/auth.guard';
import { Request } from 'express';
import { CreateProductsDto } from './dto/products.dto';

@Controller('products')
@UseGuards(AuthGuard)
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get(':name')
  getProduct(@Req() request: Request, @Param('name') name: string) {
    const users = request.user as { id: number; email: string };
    name = name.replaceAll('_', ' ');
    return this.productsService.getProduct(name, users.id);
  }

  @Get()
  getProducts(@Req() request: Request) {
    const users = request.user as { id: number; email: string };
    return this.productsService.getProducts(users.id);
  }

  @Post('create')
  createProduct(
    @Req() request: Request,
    @Body() createProduct: CreateProductsDto,
  ) {
    const users = request.user as { id: number; email: string };
    return this.productsService.createProduct(users.id, createProduct);
  }
}
