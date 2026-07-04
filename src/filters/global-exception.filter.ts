import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus, BadRequestException } from '@nestjs/common';
import { Logger } from '@myko.pk/logger';
import { Request, Response } from 'express';

const ERROR_TITLES: Record<number, string> = {
  400: 'Bad Request',
  401: 'Unauthorized',
  403: 'Forbidden',
  404: 'Page Not Found',
  405: 'Method Not Allowed',
  408: 'Request Timeout',
  409: 'Conflict',
  410: 'Gone',
  422: 'Unprocessable Entity',
  429: 'Too Many Requests',
  500: 'Internal Server Error',
  502: 'Bad Gateway',
  503: 'Service Unavailable',
  504: 'Gateway Timeout',
};

const ERROR_DESCRIPTIONS: Record<number, string> = {
  400: 'The request could not be processed due to invalid data. Please check your input and try again.',
  401: 'You need to be signed in to access this page. Please sign in and try again.',
  403: "You don't have permission to access this page. If you believe this is a mistake, contact support.",
  404: "The page you're looking for doesn't exist or has been moved. Check the URL and try again.",
  405: 'This page does not support the request method used.',
  408: 'The server timed out waiting for your request. Please try again.',
  409: 'The request could not be completed due to a conflict with the current state of the resource.',
  422: 'The submitted data could not be processed. Please review your input and try again.',
  429: 'Too many requests. Please wait a moment before trying again.',
  500: 'Something went wrong on our end. Please try again later.',
  502: 'The server received an invalid response from an upstream server. Please try again later.',
  503: 'The server is temporarily unavailable. Please try again later.',
  504: 'The server timed out waiting for an upstream server. Please try again later.',
};

function getErrorTitle(statusCode: number): string {
  return ERROR_TITLES[statusCode] || 'Something Went Wrong';
}

function getErrorDescription(statusCode: number): string {
  return ERROR_DESCRIPTIONS[statusCode] || 'An unexpected error occurred. Please try again later.';
}

function isBrowserRequest(request: Request): boolean {
  const accept = request.headers?.accept;
  return typeof accept === 'string' && accept.includes('text/html');
}

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const requestId = request.headers['x-request-id'] as string | undefined;

    let statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';
    let errorCode = 'INTERNAL_ERROR';
    let details: any = undefined;

    if (exception instanceof HttpException) {
      statusCode = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      if (typeof exceptionResponse === 'object') {
        const responseObj = exceptionResponse as any;
        message = responseObj.message || exception.message;
        details = responseObj.error || responseObj.errors;
        errorCode = responseObj.code || exception.constructor.name.replace('Exception', '').toUpperCase();

        if (exception instanceof BadRequestException && !responseObj.code) {
          errorCode = 'VALIDATION_ERROR';
          message = 'Validation failed';
        }
      } else {
        message = exceptionResponse as string;
        errorCode = exception.constructor.name.replace('Exception', '').toUpperCase();
      }
    } else if (exception instanceof Error) {
      message = exception.message;
      errorCode = exception.name || 'ERROR';
    }

    const errorResponse = {
      success: false,
      statusCode,
      message,
      error: {
        code: errorCode,
        details: details,
      },
      timestamp: new Date().toISOString(),
      requestId,
    };

    // Log error with appropriate level
    const logContext = {
      statusCode,
      message,
      method: request.method,
      url: request.url,
      ip: request.ip,
      userAgent: request.headers['user-agent'],
      errorCode,
    };

    if (statusCode >= 500) {
      this.logger.error(`[${requestId}] ${errorCode}:`, logContext);
    } else if (statusCode >= 400) {
      this.logger.warn(`[${requestId}] ${errorCode}:`, logContext);
    } else {
      this.logger.debug(`[${requestId}] ${errorCode}:`, logContext);
    }

    if (response.headersSent) return;

    // Render error page for browser requests, JSON for API requests
    if (isBrowserRequest(request)) {
      const showMessage = statusCode < 500 || process.env.NODE_ENV !== 'production';
      const renderOptions = {
        statusCode,
        title: getErrorTitle(statusCode),
        description: getErrorDescription(statusCode),
        message: showMessage ? message : 'Something went wrong. Please try again later.',
        errorCode,
        showMessage,
      };

      response.setHeader('Content-Security-Policy',
        "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self'; connect-src 'self'",
      );

      response.status(statusCode);
      response.render('error', renderOptions, (renderErr: any, html: string) => {
        if (renderErr) {
          this.logger.error(`[${requestId}] Failed to render error page:`, renderErr);
          return response.json(errorResponse);
        }
        response.send(html);
      });
    } else {
      response.status(statusCode).json(errorResponse);
    }
  }
}
