import { HttpException, HttpStatus } from '@nestjs/common';

export class EmailAlreadyExistsException extends HttpException {
  constructor(email: string) {
    super(`Email '${email}' is already registered.`, HttpStatus.CONFLICT);
  }
}
