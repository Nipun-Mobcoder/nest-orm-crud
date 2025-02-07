import {
  IsEnum,
  IsNumber,
  IsPositive,
  IsString,
  Length,
} from 'class-validator';
import { ProductType } from '../enums/productType.enum';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProductsDto {
  @IsString()
  @ApiProperty({ example: 'Iphone 15' })
  name: string;

  @IsEnum(ProductType)
  @ApiProperty({ enum: ProductType })
  productType: ProductType;

  @IsString()
  @Length(20, 500)
  @ApiProperty({
    example:
      'The iPhone 15 features a stunning 6.1-inch Super Retina XDR display, offering vibrant colors and true blacks. Powered by the A16 Bionic chip, it delivers lightning-fast performance and exceptional energy efficiency. The advanced dual-camera system includes a 48MP main sensor for breathtaking detail and improved low-light photography. With Dynamic Island and USB-C connectivity, the iPhone 15 redefines convenience and innovation.',
  })
  productDescription: string;

  @IsNumber()
  @IsPositive()
  @ApiProperty({ example: 65000 })
  productPrice: number;
}
