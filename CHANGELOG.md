# Changelog

## 1.0.0 (2026-07-04)

### Initial Release

Shared response utilities, builders, and exception filters for MYKO services. Provides a unified `ApiResponse<T>` envelope, configurable NestJS exception filters, and a response interceptor for automatic wrapping.

#### Key Exports
- **`ResponseBuilder`** — fluent API for success, error, paginated, and specialised responses
- **`ResponseModule.forRoot()`** — configurable module for registering exception filters and interceptor
- **`ResponseInterceptor`** — automatically wraps controller returns in `ApiResponse`
- **`GlobalExceptionFilter`** — catches all uncaught exceptions, renders HTML for browser requests
- **`ValidationExceptionFilter`** — formats `BadRequestException` with field-level validation errors
- **`HttpExceptionFilter`** — handles all `HttpException` instances
- **`DatabaseExceptionFilter`** — handles TypeORM and Prisma database errors
- **`AuthExceptionFilter`** — handles `UnauthorizedException` and `ForbiddenException`
- **`HTTP_STATUS`** — constants for standard HTTP status codes
- **`RESPONSE_MESSAGES`** — default response message constants
- **`RESPONSE_FILTERS`** — lookup for selecting specific filters in `ResponseModule.forRoot()`
