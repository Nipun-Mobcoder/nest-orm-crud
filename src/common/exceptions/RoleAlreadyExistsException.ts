import { HttpException, HttpStatus } from '@nestjs/common';

export class RolesAlreadyExistsException extends HttpException {
  constructor(name: string) {
    super(`Role '${name}' is already created.`, HttpStatus.CONFLICT);
  }
}
