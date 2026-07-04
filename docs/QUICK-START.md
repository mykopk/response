# Quick Start

## Installation

```bash
npm install @myko.pk/response

# Optional — for paginated DTOs
npm install class-validator class-transformer

# Optional — for Swagger decorator
npm install @nestjs/swagger
```

## 1. Register the Module

In your root `AppModule`, import `ResponseModule.forRoot()`:

```ts
import { Module } from '@nestjs/common';
import { ResponseModule } from '@myko.pk/response';

@Module({
  imports: [
    ResponseModule.forRoot({
      // Register all 5 exception filters
      filters: ['GLOBAL', 'VALIDATION', 'HTTP', 'DATABASE', 'AUTH'],
      // Automatically wrap all controller responses in ApiResponse<T>
      enableResponseWrapper: true,
      // Track requestId across the request lifecycle via AsyncLocalStorage
      enableRequestContext: true,
    }),
  ],
})
export class AppModule {}
```

## 2. Use the Response Builder

```ts
import { ResponseBuilder } from '@myko.pk/response';

@Controller('/users')
export class UsersController {
  @Get()
  findAll() {
    const users = [{ id: 1, name: 'Alice' }];
    return ResponseBuilder.paginated(users, 1, 1, 20, 'Users fetched');
  }

  @Post()
  create(@Body() dto: CreateUserDto) {
    const user = this.service.create(dto);
    // Returns ApiResponse with 201 status code
    return ResponseBuilder.created(user);
  }

  @Delete(':id')
  delete() {
    // Returns ApiResponse with no data field
    return ResponseBuilder.ok('User deleted');
  }
}
```

If `enableResponseWrapper` is on, plain returns are also wrapped:

```ts
@Get('/hello')
hello() {
  return { message: 'world' };
  // Wrapped: ApiResponse<{ message: string }>
}
```

## 3. Skip Wrapping for Specific Routes

```ts
import { SkipResponseWrapper } from '@myko.pk/response';

@Get('/raw')
@SkipResponseWrapper()
getRaw() {
  return { raw: 'data' };  // not wrapped
}
```

## 4. Override the Response Message

```ts
import { ResponseMessage } from '@myko.pk/response';

@Get('/status')
@ResponseMessage('Service status retrieved')
getStatus() {
  return { healthy: true };
}
```

## 5. Use Paginated DTOs

```ts
import { PaginatedQueryDto } from '@myko.pk/response';

@Get('/users')
async getUsers(@Query() query: PaginatedQueryDto) {
  // query.page  — number, default 1
  // query.limit — number, default 20, max 100
  const { data, total } = await this.service.find(query.page, query.limit);
  return ResponseBuilder.paginated(data, total, query.page, query.limit);
}
```

## 6. Request Context

```ts
import { responseContext } from '@myko.pk/response';

@Injectable()
export class LoggingService {
  log(message: string) {
    const ctx = responseContext.getStore();
    console.log(`[${ctx?.requestId}] ${message}`);
  }
}
```

## 7. Swagger Documentation

```ts
import { ApiResponseEnvelope } from '@myko.pk/response';

@Get('/users/:id')
@ApiResponseEnvelope(UserDto)
getUser(@Param('id') id: string) {
  return this.service.findById(id);
}
// OpenAPI schema will show: ApiResponse<UserDto>
```

## What's Next?

See the [full README](../README.md) for all ResponseBuilder methods, filter options, and API reference.
