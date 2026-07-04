import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ResponseBuilder } from '../builders/response.builder';
import { ApiResponse } from '../types';

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, any> {
  intercept(context: ExecutionContext, next: CallHandler<T>): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        const response = context.switchToHttp().getResponse();
        if (response.headersSent) return data;

        if (data && typeof data === 'object' && 'success' in data && 'statusCode' in data) {
          return data;
        }

        const requestId = context.switchToHttp().getRequest().headers['x-request-id'];
        return ResponseBuilder.success(data, 'Success', response.statusCode, requestId);
      }),
    );
  }
}
