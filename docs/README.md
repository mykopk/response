# Docs

Documentation for **@myko.pk/response**.

## Available Docs

| Document | Description |
|----------|-------------|
| [QUICK-START.md](./QUICK-START.md) | 5-minute setup guide — install, module config, basic usage |

## Module Reference

All public APIs are documented in the [README](../README.md):

- **ResponseBuilder** — `ok()`, `success()`, `created()`, `accepted()`, `noContent()`, `updated()`, `deleted()`, `error()`, `paginated()`, `cursorPaginated()`, `redirect()`, `fileDownload()`, `bulkOperation()`, `partialSuccess()`, `importExport()`
- **Decorators** — `@SkipResponseWrapper()`, `@ResponseMessage()`
- **Interceptors** — `ResponseInterceptor`, `RequestContextInterceptor`
- **Filters** — `GlobalExceptionFilter`, `ValidationExceptionFilter`, `HttpExceptionFilter`, `DatabaseExceptionFilter`, `AuthExceptionFilter`
- **DTOs** — `PaginatedQueryDto`, `CursorPaginatedQueryDto`
- **Swagger** — `@ApiResponseEnvelope(model)`
- **Validation** — `formatValidationErrors()`
- **Context** — `responseContext` (AsyncLocalStorage), `ResponseContext` interface
- **Constants** — `HTTP_STATUS`, `RESPONSE_MESSAGES`, `RESPONSE_FILTERS`
