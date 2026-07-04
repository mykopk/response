import { ExceptionFilter, Catch, ArgumentsHost, BadRequestException } from '@nestjs/common';
import { Logger } from '@myko.pk/logger';
import { Response } from 'express';

/**
 * Validation Exception Filter
 * Handles validation errors from class-validator and pipes
 * Formats validation errors in a user-friendly way
 */
@Catch(BadRequestException)
export class ValidationExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(ValidationExceptionFilter.name);

  catch(exception: BadRequestException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest();
    const requestId = request.headers['x-request-id'];

    const exceptionResponse = exception.getResponse() as any;
    const rawErrors = exceptionResponse.message;
    const errors = Array.isArray(rawErrors) ? rawErrors : typeof rawErrors === 'string' ? [rawErrors] : [];

    // Format validation errors
    const formattedErrors = this.formatValidationErrors(errors);

    const errorResponse = {
      success: false,
      statusCode: 400,
      message: 'Validation failed',
      error: {
        code: 'VALIDATION_ERROR',
        details: formattedErrors,
      },
      timestamp: new Date().toISOString(),
      requestId,
    };

    this.logger.warn(`[${requestId}] Validation error:`, {
      method: request.method,
      url: request.url,
      errors: formattedErrors,
    });

    response.status(400).json(errorResponse);
  }

  /**
   * Format validation errors from class-validator
   */
  private formatValidationErrors(errors: any[]): string[] {
    const messages: string[] = [];

    if (Array.isArray(errors)) {
      errors.forEach((error) => {
        if (typeof error === 'string') {
          messages.push(error);
        } else if (error?.constraints) {
          messages.push(...Object.values(error.constraints) as string[]);
        }
      });
    }

    return messages;
  }
}
