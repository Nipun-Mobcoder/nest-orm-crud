import { HttpException, HttpStatus } from '@nestjs/common';

export class UserNotFoundException extends HttpException {
  constructor(email: string) {
    super(`User with email '${email}' not found.`, HttpStatus.NOT_FOUND);
  }
}
