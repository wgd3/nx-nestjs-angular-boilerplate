import type { Type } from '@nestjs/common';
import { applyDecorators } from '@nestjs/common';
import { ApiExtraModels, ApiOkResponse, getSchemaPath } from '@nestjs/swagger';

import { PaginationResponseDto } from './dtos/pagination/pagination-response.dto';

/**
 * Credit to https://github.com/NarHakobyan/awesome-nest-boilerplate/blob/0ebc649acc1e3406bf13684121f2471ee329cc3e/src/decorators/api-page-ok-response.decorator.ts
 * @param options
 * @returns
 */
export function ApiPageOkResponse<T extends Type>(options: {
  type: T;
  description?: string;
}): MethodDecorator {
  return applyDecorators(
    ApiExtraModels(PaginationResponseDto),
    ApiExtraModels(options.type),
    ApiOkResponse({
      description: options.description,
      schema: {
        allOf: [
          { $ref: getSchemaPath(PaginationResponseDto) },
          {
            properties: {
              data: {
                type: 'array',
                items: { $ref: getSchemaPath(options.type) },
              },
            },
          },
        ],
      },
    }),
  );
}
