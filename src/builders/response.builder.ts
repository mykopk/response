import { ApiResponse, PaginatedResponse, CursorPaginatedResponse } from '../types';
import { HTTP_STATUS, RESPONSE_MESSAGES } from '../response.constants';
import { responseContext } from '../response.context';

export class ResponseBuilder {
  /**
   * Build a success response
   * @template T - Type of response data
   * @param data - Response data
   * @param message - Success message
   * @param statusCode - HTTP status code
   * @param requestId - Request tracking ID for correlation
   * @returns ApiResponse with success data
   */
  static success<T = any>(
    data: T,
    message: string = RESPONSE_MESSAGES.SUCCESS,
    statusCode: number = HTTP_STATUS.OK,
    requestId?: string
  ): ApiResponse<T> {
    return {
      success: true,
      statusCode,
      message,
      data,
      timestamp: new Date().toISOString(),
      requestId,
    };
  }

  /**
   * Shorthand success response with no data payload (e.g. status-only endpoints)
   * @param message - Success message
   * @param statusCode - HTTP status code
   * @param requestId - Request tracking ID for correlation
   * @returns ApiResponse with no data field
   */
  static ok(
    message: string = RESPONSE_MESSAGES.SUCCESS,
    statusCode: number = HTTP_STATUS.OK,
    requestId?: string
  ): ApiResponse {
    return {
      success: true,
      statusCode,
      message,
      timestamp: new Date().toISOString(),
      requestId,
    };
  }

  /**
   * Build an error response
   * @param message - Error message
   * @param code - Error code for categorization
   * @param statusCode - HTTP status code
   * @param details - Additional error details
   * @param requestId - Request tracking ID for correlation
   * @returns ApiResponse with error information
   */
  static error(
    message: string,
    code: string,
    statusCode: number = HTTP_STATUS.BAD_REQUEST,
    details?: string,
    requestId?: string
  ): ApiResponse {
    return {
      success: false,
      statusCode,
      message,
      error: {
        code,
        details,
      },
      timestamp: new Date().toISOString(),
      requestId,
    };
  }

  /**
   * Build a paginated response
   * @template T - Type of array items
   * @param data - Array of items
   * @param total - Total number of items available
   * @param page - Current page number
   * @param limit - Items per page
   * @param message - Success message
   * @param statusCode - HTTP status code
   * @param requestId - Request tracking ID for correlation
   * @returns PaginatedResponse with pagination metadata
   */
  static paginated<T = any>(
    data: T[],
    total: number,
    page: number,
    limit: number,
    message: string = RESPONSE_MESSAGES.SUCCESS,
    statusCode: number = HTTP_STATUS.OK,
    requestId?: string
  ): PaginatedResponse<T> {
    const pages = Math.ceil(total / limit);
    return {
      success: true,
      statusCode,
      message,
      data,
      pagination: {
        total,
        page,
        limit,
        pages,
      },
      timestamp: new Date().toISOString(),
      requestId,
    };
  }

  /**
   * Build a cursor-based paginated response for infinite-scroll / "load more" patterns
   * @template T - Type of array items
   * @param data - Array of items for the current page
   * @param total - Total number of items available
   * @param nextCursor - Cursor string for the next page
   * @param hasNextPage - Whether more items exist after this page
   * @param limit - Items per page
   * @param message - Success message
   * @param statusCode - HTTP status code
   * @param requestId - Request tracking ID for correlation
   * @returns CursorPaginatedResponse with cursor metadata
   */
  static cursorPaginated<T = any>(
    data: T[],
    total: number,
    nextCursor: string | undefined,
    hasNextPage: boolean,
    limit: number,
    previousCursor?: string,
    hasPreviousPage?: boolean,
    message: string = RESPONSE_MESSAGES.SUCCESS,
    statusCode: number = HTTP_STATUS.OK,
    requestId?: string
  ): CursorPaginatedResponse<T> {
    return {
      success: true,
      statusCode,
      message,
      data,
      pagination: {
        total,
        nextCursor,
        previousCursor,
        hasNextPage,
        hasPreviousPage: hasPreviousPage ?? false,
        limit,
      },
      timestamp: new Date().toISOString(),
      requestId,
    };
  }

  /**
   * Build a created (201) response
   * @template T - Type of response data
   * @param data - Created resource data
   * @param message - Success message
   * @param requestId - Request tracking ID for correlation
   * @returns ApiResponse with 201 status code
   */
  static created<T = any>(
    data: T,
    message: string = RESPONSE_MESSAGES.CREATED,
    requestId?: string
  ): ApiResponse<T> {
    return this.success(data, message, HTTP_STATUS.CREATED, requestId);
  }

  /**
   * Build an accepted (202) response for async operations
   * @template T - Type of response data
   * @param data - Response data (optional)
   * @param message - Success message
   * @param requestId - Request tracking ID for correlation
   * @returns ApiResponse with 202 status code
   */
  static accepted<T = any>(
    data: T,
    message: string = RESPONSE_MESSAGES.ACCEPTED,
    requestId?: string
  ): ApiResponse<T> {
    return this.success(data, message, HTTP_STATUS.ACCEPTED, requestId);
  }

  /**
   * Build a no content (204) response
   * @param message - Success message
   * @param requestId - Request tracking ID for correlation
   * @returns ApiResponse with 204 status code
   */
  static noContent(
    message: string = RESPONSE_MESSAGES.NO_CONTENT,
    requestId?: string
  ): ApiResponse {
    return {
      success: true,
      statusCode: HTTP_STATUS.NO_CONTENT,
      message,
      timestamp: new Date().toISOString(),
      requestId,
    };
  }

  /**
   * Response for successful update operations
   * @param data - Updated resource data
   * @param message - Success message
   * @param requestId - Request tracking ID
   */
  static updated<T = any>(
    data: T,
    message: string = RESPONSE_MESSAGES.UPDATED,
    requestId?: string
  ): ApiResponse<T> {
    return this.success(data, message, HTTP_STATUS.OK, requestId);
  }

  /**
   * Response for successful delete operations
   * @param message - Success message
   * @param requestId - Request tracking ID
   */
  static deleted(
    message: string = RESPONSE_MESSAGES.DELETED,
    requestId?: string
  ): ApiResponse {
    return {
      success: true,
      statusCode: HTTP_STATUS.OK,
      message,
      timestamp: new Date().toISOString(),
      requestId,
    };
  }

  /**
   * Response for bulk operations (create, update, delete multiple)
   * @param succeeded - Number of successful operations
   * @param failed - Number of failed operations
   * @param total - Total operations attempted
   * @param requestId - Request tracking ID
   */
  static bulkOperation(
    succeeded: number,
    failed: number,
    total: number,
    requestId?: string
  ): ApiResponse {
    const message = failed === 0
      ? `All ${total} operations completed successfully`
      : `${succeeded} succeeded, ${failed} failed out of ${total} operations`;

    return {
      success: failed === 0,
      statusCode: failed === 0 ? HTTP_STATUS.OK : HTTP_STATUS.MULTI_STATUS,
      message,
      data: {
        succeeded,
        failed,
        total,
      },
      timestamp: new Date().toISOString(),
      requestId,
    };
  }

  /**
   * Response for partial success scenarios
   * @param data - Partial data that was processed
   * @param message - Message describing the partial success
   * @param requestId - Request tracking ID
   */
  static partialSuccess<T = any>(
    data: T,
    message: string = RESPONSE_MESSAGES.PARTIAL_SUCCESS,
    requestId?: string
  ): ApiResponse<T> {
    return {
      success: true,
      statusCode: HTTP_STATUS.MULTI_STATUS,
      message,
      data,
      timestamp: new Date().toISOString(),
      requestId,
    };
  }

  /**
   * Response for redirect operations
   * @param url - Redirect URL
   * @param statusCode - HTTP status code (301, 302, 307, 308)
   * @param message - Redirect message
   * @param requestId - Request tracking ID
   */
  static redirect(
    url: string,
    statusCode: number = HTTP_STATUS.FOUND,
    message: string = RESPONSE_MESSAGES.REDIRECTING,
    requestId?: string
  ): ApiResponse {
    return {
      success: true,
      statusCode,
      message,
      data: { url },
      timestamp: new Date().toISOString(),
      requestId,
    };
  }

  /**
   * Response for file download operations
   * @param filename - Name of the file being downloaded
   * @param size - File size in bytes
   * @param mimeType - MIME type of the file
   * @param requestId - Request tracking ID
   */
  static fileDownload(
    filename: string,
    size: number,
    mimeType: string,
    requestId?: string
  ): ApiResponse {
    return {
      success: true,
      statusCode: HTTP_STATUS.OK,
      message: RESPONSE_MESSAGES.FILE_READY,
      data: {
        filename,
        size,
        mimeType,
      },
      timestamp: new Date().toISOString(),
      requestId,
    };
  }

  /**
   * Response for import/export operations
   * @param processed - Number of records processed
   * @param imported - Number of records imported
   * @param skipped - Number of records skipped
   * @param errors - Array of error messages
   * @param requestId - Request tracking ID
   */
  static importExport(
    processed: number,
    imported: number,
    skipped: number,
    errors: string[] = [],
    requestId?: string
  ): ApiResponse {
    const hasErrors = errors.length > 0;
    const message = hasErrors
      ? `Imported ${imported} records with ${errors.length} errors`
      : `Successfully imported ${imported} records`;

    return {
      success: !hasErrors,
      statusCode: hasErrors ? HTTP_STATUS.MULTI_STATUS : HTTP_STATUS.OK,
      message,
      data: {
        processed,
        imported,
        skipped,
        errors: hasErrors ? errors : undefined,
      },
      timestamp: new Date().toISOString(),
      requestId,
    };
  }
}
