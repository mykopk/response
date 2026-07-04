import { ExceptionFilter, Catch, ArgumentsHost } from '@nestjs/common';
import { Logger } from '@myko.pk/logger';
import { Response } from 'express';

/**
 * Database Exception Filter
 * Handles database errors (TypeORM, Prisma, etc.)
 * Prevents sensitive database information from leaking
 */
@Catch()
export class DatabaseExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(DatabaseExceptionFilter.name);

  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest();
    const requestId = request.headers['x-request-id'];

    // Check if it's a database error
    if (!this.isDatabaseError(exception)) {
      throw exception; // Let other filters handle it
    }

    const { statusCode, message, errorCode } = this.parseError(exception);

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

    this.logger.error(`[${requestId}] Database error:`, {
      statusCode,
      message,
      errorCode,
      method: request.method,
      url: request.url,
      // Log full error details in development only
      ...(process.env.NODE_ENV !== 'production' && { details: exception.message }),
    });

    response.status(statusCode).json(errorResponse);
  }

  /**
   * Check if exception is a database error
   */
  private isDatabaseError(exception: any): boolean {
    const errorName = exception.constructor.name;
    const errorMessage = exception.message || '';

    // TypeORM errors
    if (errorName.includes('QueryFailedError') || errorName.includes('EntityNotFound')) {
      return true;
    }

    // Prisma errors
    if (errorName.includes('PrismaClientKnownRequestError') || errorName.includes('PrismaClientValidationError')) {
      return true;
    }

    // Generic database error indicators
    if (
      errorMessage.includes('UNIQUE constraint failed') ||
      errorMessage.includes('Foreign key constraint') ||
      errorMessage.includes('Duplicate entry') ||
      errorMessage.includes('violates unique constraint')
    ) {
      return true;
    }

    return false;
  }

  /**
   * Parse database error and return user-friendly message
   */
  private parseError(exception: any): { statusCode: number; message: string; errorCode: string } {
    const errorMessage = exception.message || '';
    const errorCode = exception.code || 'DATABASE_ERROR';

    // Unique constraint violation
    if (
      errorMessage.includes('UNIQUE constraint failed') ||
      errorMessage.includes('Duplicate entry') ||
      errorMessage.includes('violates unique constraint') ||
      errorCode === 'P2002'
    ) {
      return {
        statusCode: 409,
        message: 'This record already exists',
        errorCode: 'DUPLICATE_ENTRY',
      };
    }

    // Foreign key constraint
    if (
      errorMessage.includes('Foreign key constraint') ||
      errorMessage.includes('FOREIGN KEY constraint failed') ||
      errorCode === 'P2003'
    ) {
      return {
        statusCode: 400,
        message: 'Invalid reference to related record',
        errorCode: 'INVALID_REFERENCE',
      };
    }

    // Record not found
    if (errorMessage.includes('No entity found') || errorCode === 'P2025') {
      return {
        statusCode: 404,
        message: 'Record not found',
        errorCode: 'NOT_FOUND',
      };
    }

    // Validation error
    if (errorMessage.includes('Validation failed') || errorCode === 'P2007') {
      return {
        statusCode: 400,
        message: 'Invalid data provided',
        errorCode: 'VALIDATION_ERROR',
      };
    }

    // Generic database error
    return {
      statusCode: 500,
      message: 'Database operation failed',
      errorCode: 'DATABASE_ERROR',
    };
  }
}
