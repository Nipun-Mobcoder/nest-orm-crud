import { HttpException, HttpStatus } from '@nestjs/common';

export class ProductAlreadyExistsException extends HttpException {
  constructor(product: string, email: string) {
    super(
      `Product '${product}' is already created for user ${email}.`,
      HttpStatus.CONFLICT,
    );
  }
}
