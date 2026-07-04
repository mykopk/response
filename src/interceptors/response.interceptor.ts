import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ResponseBuilder } from '../builders/response.builder';
import { ApiResponse } from '../types';
import { SKIP_RESPONSE_WRAPPER } from '../decorators/skip-response-wrapper.decorator';
import { RESPONSE_MESSAGE } from '../decorators/response-message.decorator';
import { responseContext } from '../response.context';

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, any> {
  constructor(private readonly reflector: Reflector) {}

  intercept(context: ExecutionContext, next: CallHandler<T>): Observable<any> {
    const skip = this.reflector.getAllAndOverride<boolean>(SKIP_RESPONSE_WRAPPER, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (skip) return next.handle();

    const customMessage = this.reflector.getAllAndOverride<string>(RESPONSE_MESSAGE, [
      context.getHandler(),
      context.getClass(),
    ]);

    return next.handle().pipe(
      map((data) => {
        const response = context.switchToHttp().getResponse();
        if (response.headersSent) return data;

        if (data && typeof data === 'object' && 'success' in data && 'statusCode' in data) {
          return data;
        }

        const requestId =
          context.switchToHttp().getRequest().headers['x-request-id'] as string ??
          responseContext.getStore()?.requestId;

        return ResponseBuilder.success(data, customMessage ?? 'Success', response.statusCode, requestId);
      }),
    );
  }
}
