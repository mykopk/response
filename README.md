<p align="center">
  <h1 align="center">@myko.pk/response</h1>
  <p align="center"><strong>Consistent responses. Clear errors.</strong></p>
  <p align="center">Shared response utilities, builders, and exception filters for MYKO services. Provides a unified API response envelope, configurable NestJS exception filters, a response interceptor for automatic wrapping, request context tracking, Swagger integration, and reusable pagination DTOs.</p>
  <p align="center">
    <a href="https://www.npmjs.com/package/@myko.pk/response"><img src="https://img.shields.io/npm/v/@myko.pk/response?style=for-the-badge&logo=npm&logoColor=white" alt="npm version"></a>
    <a href="https://www.npmjs.com/package/@myko.pk/response"><img src="https://img.shields.io/npm/dm/@myko.pk/response?style=for-the-badge&logo=npm&logoColor=white" alt="npm downloads"></a>
    <a href="https://github.com/mykopk/response/actions"><img src="https://img.shields.io/github/actions/workflow/status/mykopk/response/ci.yml?style=for-the-badge&logo=githubactions&logoColor=white&label=CI" alt="build"></a>
    <a href="https://github.com/mykopk/response"><img src="https://img.shields.io/github/stars/mykopk/response?style=for-the-badge&logo=github" alt="stars"></a>
    <a href="https://github.com/mykopk/response"><img src="https://img.shields.io/github/forks/mykopk/response?style=for-the-badge&logo=github" alt="forks"></a>
    <a href="https://github.com/mykopk/response"><img src="https://img.shields.io/github/issues/mykopk/response?style=for-the-badge&logo=github" alt="issues"></a>
    <a href="https://github.com/mykopk/response"><img src="https://img.shields.io/github/last-commit/mykopk/response?style=for-the-badge&logo=github" alt="last commit"></a>
    <a href="./LICENSE"><img src="https://img.shields.io/badge/license-MIT-green?style=for-the-badge" alt="license"></a>
  </p>
</p>

## 📑 Table of Contents

- [Description](#description)
- [Key Features](#key-features)
- [Use Cases](#use-cases)
- [Tech Stack](#tech-stack)
- [Quick Start](#quick-start)
- [Available Scripts](#available-scripts)
- [Project Structure](#project-structure)
- [Contributors](#contributors)
- [Contributing](#contributing)
- [License](#license)

## 📝 Description

@myko.pk/response provides a standardised response envelope (`ApiResponse<T>`) and a set of reusable NestJS exception filters for every MYKO service. The `ResponseBuilder` class offers a fluent API for constructing success, error, paginated, cursor-paginated, and specialised responses. Built-in exception filters handle `HttpException`, validation errors, database errors, and auth failures — all rendered into a consistent `ApiResponse` shape.

The package also includes a request context system (AsyncLocalStorage-based requestId tracking across the request lifecycle), decorators for fine-grained control over response wrapping, reusable pagination DTOs, a Swagger decorator to document the `ApiResponse` envelope, and a validation error formatter utility.

## ✨ Key Features

- **📦 Unified Response Envelope** — Every response follows the `ApiResponse<T>` shape: `success`, `statusCode`, `message`, `data`, `error`, `timestamp`, `requestId`.
- **🏗️ Fluent Response Builder** — `ResponseBuilder.success()`, `ResponseBuilder.error()`, `ResponseBuilder.paginated()`, `ResponseBuilder.cursorPaginated()`, `ResponseBuilder.ok()`, and specialised methods for bulk, import/export, redirect, file download, and partial success.
- **🛡️ Configurable Exception Filters** — 5 NestJS exception filters covering global, validation, HTTP, database, and auth exceptions. Register all or pick specific ones via `ResponseModule.forRoot()`.
- **🔄 Response Interceptor** — Automatically wraps controller returns into `ApiResponse`. Respects `@SkipResponseWrapper()` and `@ResponseMessage()` decorators.
- **🔗 Request Context** — `RequestContextInterceptor` captures or generates a `requestId` (via `x-request-id` header or `crypto.randomUUID()`) and stores it in AsyncLocalStorage. Access it anywhere with `responseContext.getStore()`.
- **📐 Reusable DTOs** — `PaginatedQueryDto` and `CursorPaginatedQueryDto` with `class-validator` decorators for consistent pagination parameters.
- **📘 Swagger Integration** — `@ApiResponseEnvelope(YourDto)` decorator documents the full `ApiResponse<T>` wrapper shape in your OpenAPI spec.
- **🔍 Validation Formatter** — `formatValidationErrors()` flattens NestJS `ValidationError[]` into a structured `{ field, constraints, children? }[]` shape.
- **📘 Fully Typed** — Full TypeScript support with strict mode, typed response envelopes, and filter options.

## 🎯 Use Cases

- Standardising API response format across all MYKO NestJS microservices.
- Replacing ad-hoc error handling with consistent, typed exception filters.
- Automatically wrapping all controller responses in a uniform envelope.
- Tracking request IDs across the entire request lifecycle without manual parameter passing.
- Handling validation errors with structured field-level error messages.
- Documenting the `ApiResponse` envelope in Swagger/OpenAPI without manual schema definitions.
- Building paginated endpoints with reusable, validated query DTOs.
- Rendering user-friendly error pages for browser-facing requests.

## 🛠️ Tech Stack

- 📘 **TypeScript** (strict mode)
- 🪺 **NestJS** (optional: `@nestjs/swagger` for OpenAPI decorator)
- 🚂 **Express**

## ⚡ Quick Start

### Installation

```bash
npm install @myko.pk/response

# Optional — for paginated DTOs
npm install class-validator class-transformer

# Optional — for Swagger decorator
npm install @nestjs/swagger
```

### Response Builder

```ts
import { ResponseBuilder } from '@myko.pk/response';

// Success response
ResponseBuilder.success(data, 'User fetched', 200, requestId);
ResponseBuilder.created(newUser);                    // 201
ResponseBuilder.ok('Operation completed');            // 200, no data
ResponseBuilder.noContent('Item deleted');            // 204

// Error response
ResponseBuilder.error('User not found', 'USER_NOT_FOUND', 404, 'User ID: 123', requestId);

// Offset pagination
ResponseBuilder.paginated(items, total, page, limit);

// Cursor pagination (infinite scroll / load more)
ResponseBuilder.cursorPaginated(items, total, nextCursor, hasNextPage, limit);
```

### Module Registration

```ts
import { Module } from '@nestjs/common';
import { ResponseModule } from '@myko.pk/response';

@Module({
  imports: [
    ResponseModule.forRoot({
      filters: ['GLOBAL', 'VALIDATION', 'HTTP', 'DATABASE', 'AUTH'],
      enableResponseWrapper: true,     // auto-wrap controller returns
      enableRequestContext: true,       // auto-track requestId via AsyncLocalStorage
    }),
  ],
})
export class AppModule {}
```

### Decorators

```ts
import { SkipResponseWrapper, ResponseMessage } from '@myko.pk/response';

@SkipResponseWrapper()              // skip auto-wrapping for this route
@ResponseMessage('Users fetched')   // override default "Success" message
@Get('/users')
getUsers() { ... }
```

### Swagger

```ts
import { ApiResponseEnvelope } from '@myko.pk/response';
import { UserDto } from './user.dto';

@Get('/users')
@ApiResponseEnvelope(UserDto)       // documents ApiResponse<UserDto> in OpenAPI
getUsers() { ... }
```

### Paginated DTOs

```ts
import { PaginatedQueryDto, CursorPaginatedQueryDto } from '@myko.pk/response';

@Get('/users')
async getUsers(@Query() query: PaginatedQueryDto) {
  // query.page  -> number (default 1)
  // query.limit -> number (default 20, max 100)
}
```

### Request Context (AsyncLocalStorage)

```ts
import { responseContext } from '@myko.pk/response';

// Inside any service (after RequestContextInterceptor has run)
const ctx = responseContext.getStore();
console.log(ctx?.requestId);   // "abc-123"
console.log(ctx?.path);        // "/api/users"
console.log(ctx?.method);      // "GET"
```

## 🚀 Available Scripts

- **build** — `npm run build` (tsup → CJS + ESM + DTS, copies views/)
- **dev** — `npm run dev` (tsup --watch)
- **typecheck** — `npm run typecheck` (tsc --noEmit)

## 📁 Project Structure

```
.
├── CHANGELOG.md
├── CONTRIBUTING.md
├── LICENSE
├── SECURITY.md
├── package.json
├── docs/
│   ├── README.md
│   └── QUICK-START.md
├── src
│   ├── builders
│   │   └── response.builder.ts
│   ├── decorators
│   │   ├── skip-response-wrapper.decorator.ts
│   │   └── response-message.decorator.ts
│   ├── dto
│   │   └── paginated-query.dto.ts
│   ├── filters
│   │   ├── auth.filter.ts
│   │   ├── database.filter.ts
│   │   ├── global-exception.filter.ts
│   │   ├── http-exception.filter.ts
│   │   └── validation.filter.ts
│   ├── interceptors
│   │   ├── response.interceptor.ts
│   ├── request-context
│   │   ├── request-context.interceptor.ts
│   ├── swagger
│   │   └── api-response-envelope.decorator.ts
│   ├── validation
│   │   └── validation-formatter.ts
│   ├── index.ts
│   ├── response.constants.ts
│   ├── response.context.ts
│   ├── response.module.ts
│   ├── types.ts
│   └── views-path.ts
├── tsconfig.json
├── tsup.config.mjs
└── views
    └── error.hbs
```

## 🛠️ Development Setup

1. Install Node.js (v18+ recommended)
2. Install dependencies: `npm install`
3. Build: `npm run build`

> **Note:** This package does not currently have tests. Tests will be added in a future release.

## 👥 Contributors

<p align="left">
<a href="https://github.com/arsalanwahab" title="arsalanwahab"><img src="https://avatars.githubusercontent.com/u/178069156?v=4&s=64" width="64" height="64" alt="arsalanwahab" style="border-radius:50%" /></a>
</p>

[See the full list of contributors →](https://github.com/mykopk/response/graphs/contributors)

## 👥 Contributing

Contributions are welcome! Here's the standard flow:

1. **Fork** the repository
2. **Clone** your fork: `git clone https://github.com/mykopk/response.git`
3. **Branch**: `git checkout -b feature/your-feature`
4. **Commit**: `git commit -m 'feat: add some feature'`
5. **Push**: `git push origin feature/your-feature`
6. **Open** a pull request

Please follow the existing code style and include tests for new behavior where applicable.

## 📜 License

This project is licensed under the **MIT** License.


MYKO Pakistan

Detail	Information
Website	myko.pk
Email	support@myko.pk
About	Building digital infrastructure and super-app experiences for millions of users across Pakistan.
Built with ❤️ in Pakistan 🇵🇰
