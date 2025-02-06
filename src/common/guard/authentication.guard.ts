import {
  Injectable,
  CanActivate,
  ExecutionContext,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { InternalServerException } from '../exceptions/InternalServerException';
import * as jwt from 'jsonwebtoken';
import { UserNotFoundException } from '../exceptions/UserNotFoundException';

@Injectable()
export class AuthenticationGuard implements CanActivate {
  private readonly logger = new Logger(AuthenticationGuard.name);
  constructor(private readonly configService: ConfigService) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const authHeader = request.header('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Token is missing');
    }

    const token = authHeader.split(' ')[1]?.trim();
    if (!token) {
      throw new UnauthorizedException('Token is Missing');
    }
    try {
      const secret = this.configService.get<string>('JWT_SECRET');
      if (!secret) {
        throw new InternalServerException(
          'JWT_SECRET is not defined in environment variables.',
        );
      }
      const decoded = jwt.verify(token, secret) as {
        id: string;
        email: string;
      };

      if (!decoded || !decoded.id || !decoded.email) {
        throw new UserNotFoundException(decoded?.email || 'User');
      }

      request.user = { id: parseInt(decoded.id), email: decoded.email };
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerException(error.message);
    }
    return true;
  }
}
