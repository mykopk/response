import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from '@nestjs/common';
import { Logger } from '@myko.pk/logger';
import { Response } from 'express';

/**
 * HTTP Exception Filter
 * Handles all HTTP exceptions with consistent formatting
 */
@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest();
    const requestId = request.headers['x-request-id'];

    const statusCode = exception.getStatus();
    const exceptionResponse = exception.getResponse() as any;

    const message = typeof exceptionResponse === 'string' 
      ? exceptionResponse 
      : exceptionResponse.message || exception.message;

    const errorCode = this.getErrorCode(exception, statusCode);

    const errorResponse = {
      success: false,
      statusCode,
      message,
      error: {
        code: errorCode,
        details: exceptionResponse.error || exceptionResponse.errors,
      },
      timestamp: new Date().toISOString(),
      requestId,
    };

    // Log based on status code
    const logContext = {
      statusCode,
      message,
      method: request.method,
      url: request.url,
      ip: request.ip,
    };

    if (statusCode >= 500) {
      this.logger.error(`[${requestId}] ${errorCode}:`, logContext);
    } else if (statusCode >= 400) {
      this.logger.warn(`[${requestId}] ${errorCode}:`, logContext);
    }

    response.status(statusCode).json(errorResponse);
  }

  /**
   * Get error code from exception type
   */
  private getErrorCode(exception: HttpException, statusCode: number): string {
    const exceptionName = exception.constructor.name;
    
    // Map common exceptions to error codes
    const errorCodeMap: Record<number, string> = {
      400: 'BAD_REQUEST',
      401: 'UNAUTHORIZED',
      403: 'FORBIDDEN',
      404: 'NOT_FOUND',
      409: 'CONFLICT',
      422: 'UNPROCESSABLE_ENTITY',
      429: 'TOO_MANY_REQUESTS',
      500: 'INTERNAL_SERVER_ERROR',
      502: 'BAD_GATEWAY',
      503: 'SERVICE_UNAVAILABLE',
    };

    return errorCodeMap[statusCode] || exceptionName.replace('Exception', '').toUpperCase();
  }
}
