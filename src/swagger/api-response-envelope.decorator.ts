import { applyDecorators, Type } from '@nestjs/common';
import { ApiOkResponse, ApiExtraModels, getSchemaPath } from '@nestjs/swagger';

export const ApiResponseEnvelope = <TModel extends Type<any>>(model: TModel) =>
  applyDecorators(
    ApiExtraModels(model),
    ApiOkResponse({
      schema: {
        type: 'object',
        properties: {
          success: { type: 'boolean' },
          statusCode: { type: 'number' },
          message: { type: 'string' },
          data: { $ref: getSchemaPath(model) },
          error: {
            type: 'object',
            properties: {
              code: { type: 'string' },
              details: { type: 'string' },
            },
          },
          timestamp: { type: 'string', format: 'date-time' },
          requestId: { type: 'string' },
        },
      },
    }),
  );
