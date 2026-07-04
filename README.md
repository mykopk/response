# @myko.pk/response

Shared response utilities, builders, and exception filters for MYKO services.

## Installation

```bash
npm install @myko.pk/response
```

## Usage

### Response Builder

```typescript
import { ResponseBuilder } from '@myko.pk/response';

// Success response
ResponseBuilder.success(data, 'User fetched', 200, requestId);

// Error response
ResponseBuilder.error('User not found', 'USER_NOT_FOUND', 404, 'User ID: 123', requestId);

// Paginated response
ResponseBuilder.paginated(items, total, page, limit, 'Users fetched', 200, requestId);
```

### Exception Filters

```typescript
import { ResponseModule } from '@myko.pk/response';

@Module({
  imports: [ResponseModule.forRoot()]
})
export class AppModule {}
```

Or selectively register filters:

```typescript
import { ResponseModule, RESPONSE_FILTERS } from '@myko.pk/response';

ResponseModule.forRoot({
  filters: [RESPONSE_FILTERS.GLOBAL, RESPONSE_FILTERS.VALIDATION],
});
```

### Response Interceptor

Automatically wraps controller returns in `ApiResponse`:

```typescript
ResponseModule.forRoot({ enableResponseWrapper: true });
```

## Constants

```typescript
import { HTTP_STATUS, RESPONSE_MESSAGES, RESPONSE_FILTERS } from '@myko.pk/response';

HTTP_STATUS.OK        // 200
HTTP_STATUS.CREATED   // 201
HTTP_STATUS.ACCEPTED  // 202
HTTP_STATUS.NO_CONTENT // 204

RESPONSE_MESSAGES.SUCCESS
RESPONSE_MESSAGES.CREATED
RESPONSE_MESSAGES.UPDATED
```

## API

### ResponseBuilder

| Method | Status | Description |
|--------|--------|-------------|
| `success()` | 200 | Standard success |
| `created()` | 201 | Resource created |
| `accepted()` | 202 | Async operation accepted |
| `noContent()` | 204 | No content |
| `updated()` | 200 | Resource updated |
| `deleted()` | 200 | Resource deleted |
| `error()` | 400 | Error response |
| `paginated()` | 200 | Paginated list |
| `redirect()` | 302 | Redirect |
| `fileDownload()` | 200 | File download metadata |
| `bulkOperation()` | 200/207 | Bulk operation result |
| `partialSuccess()` | 207 | Partial success |
| `importExport()` | 200/207 | Import/export result |

### Filters

| Filter | Handles |
|--------|---------|
| `GlobalExceptionFilter` | All uncaught exceptions, renders HTML for browser requests |
| `ValidationExceptionFilter` | `BadRequestException` with validation error formatting |
| `HttpExceptionFilter` | All `HttpException` instances |
| `DatabaseExceptionFilter` | Database errors (TypeORM, Prisma) |
| `AuthExceptionFilter` | `UnauthorizedException` / `ForbiddenException` |

## Build

```bash
npm run build    # tsup → dist/ (CJS + ESM)
npm run dev      # tsup --watch
```
