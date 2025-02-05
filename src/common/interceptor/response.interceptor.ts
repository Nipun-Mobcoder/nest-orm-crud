import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { Response } from 'express';

@Injectable()
export class ResponseTransformInterceptor implements NestInterceptor {
  private readonly logger = new Logger(ResponseTransformInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const response = context.switchToHttp().getResponse<Response>();
    const request = context.switchToHttp().getRequest<Request>();

    const { method, url } = request;
    const startTime = Date.now();

    return next.handle().pipe(
      map((data: any) => {
        return {
          statusCode: response.statusCode,
          success: true,
          timestamp: new Date().toISOString(),
          path: url,
          method,
          data,
        };
      }),
      tap(() => {
        const duration = Date.now() - startTime;
        this.logger.log(`Response sent for ${method} ${url} in ${duration}ms`);
      }),
    );
  }
}
