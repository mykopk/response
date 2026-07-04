import { Module, DynamicModule, Provider } from '@nestjs/common';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { GlobalExceptionFilter } from './filters/global-exception.filter';
import { ValidationExceptionFilter } from './filters/validation.filter';
import { HttpExceptionFilter } from './filters/http-exception.filter';
import { DatabaseExceptionFilter } from './filters/database.filter';
import { AuthExceptionFilter } from './filters/auth.filter';
import { ResponseInterceptor } from './interceptors/response.interceptor';
import { RESPONSE_FILTERS } from './response.constants';

export interface ResponseModuleOptions {
  filters?: Array<keyof typeof RESPONSE_FILTERS>;
  enableResponseWrapper?: boolean;
}

const FILTER_MAP: Record<keyof typeof RESPONSE_FILTERS, Provider> = {
  GLOBAL: { provide: APP_FILTER, useClass: GlobalExceptionFilter },
  VALIDATION: { provide: APP_FILTER, useClass: ValidationExceptionFilter },
  HTTP: { provide: APP_FILTER, useClass: HttpExceptionFilter },
  DATABASE: { provide: APP_FILTER, useClass: DatabaseExceptionFilter },
  AUTH: { provide: APP_FILTER, useClass: AuthExceptionFilter },
};

@Module({})
export class ResponseModule {
  static forRoot(options?: ResponseModuleOptions): DynamicModule {
    const providers: Provider[] = [];

    const filterKeys = options?.filters ?? Object.keys(FILTER_MAP) as Array<keyof typeof RESPONSE_FILTERS>;
    for (const key of filterKeys) {
      providers.push(FILTER_MAP[key]);
    }

    if (options?.enableResponseWrapper) {
      providers.push({
        provide: APP_INTERCEPTOR,
        useClass: ResponseInterceptor,
      });
    }

    return {
      module: ResponseModule,
      providers,
    };
  }
}
