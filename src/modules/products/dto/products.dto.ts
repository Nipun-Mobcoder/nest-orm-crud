import {
  IsEnum,
  IsNumber,
  IsPositive,
  IsString,
  Length,
} from 'class-validator';
import { ProductType } from '../enums/productType.enum';

export class CreateProductsDto {
  @IsString()
  name: string;

  @IsEnum(ProductType)
  productType: ProductType;

  @IsString()
  @Length(20, 500)
  productDescription: string;

  @IsNumber()
  @IsPositive()
  productPrice: number;
}
