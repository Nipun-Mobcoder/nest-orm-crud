import { HttpException, HttpStatus } from '@nestjs/common';

export class PermissionNotProvidedException extends HttpException {
  constructor(email: string) {
    super(
      `User ${email} doesn't have respective permission to do this action.`,
      HttpStatus.FORBIDDEN,
    );
  }
}
