import { ExceptionFilter, Catch, ArgumentsHost, UnauthorizedException, ForbiddenException } from '@nestjs/common';
import { Logger } from '@myko.pk/logger';
import { Response } from 'express';

/**
 * Authentication & Authorization Exception Filter
 * Handles auth-related errors with appropriate responses
 */
@Catch(UnauthorizedException, ForbiddenException)
export class AuthExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(AuthExceptionFilter.name);

  catch(exception: UnauthorizedException | ForbiddenException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest();
    const requestId = request.headers['x-request-id'];

    const statusCode = exception.getStatus();
    const exceptionResponse = exception.getResponse() as any;
    const message = typeof exceptionResponse === 'string' 
      ? exceptionResponse 
      : exceptionResponse.message || exception.message;

    const errorCode = statusCode === 401 ? 'UNAUTHORIZED' : 'FORBIDDEN';

    const errorResponse = {
      success: false,
      statusCode,
      message,
      error: {
        code: errorCode,
      },
      timestamp: new Date().toISOString(),
      requestId,
    };

    this.logger.warn(`[${requestId}] Auth error:`, {
      statusCode,
      message,
      errorCode,
      method: request.method,
      url: request.url,
      ip: request.ip,
    });

    response.status(statusCode).json(errorResponse);
  }
}
