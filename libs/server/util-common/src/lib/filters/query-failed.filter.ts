import { Response } from 'express';
import { STATUS_CODES } from 'http';
import { QueryFailedError } from 'typeorm';

import { ArgumentsHost, Catch, HttpStatus, Logger } from '@nestjs/common';
import { BaseExceptionFilter, Reflector } from '@nestjs/core';

export function isQueryFailedError(
  thrownValue: unknown,
): thrownValue is QueryFailedError {
  return thrownValue instanceof QueryFailedError;
}

/**
 *
 * @see https://stackoverflow.com/a/66519642
 * @see https://github.com/NarHakobyan/awesome-nest-boilerplate/blob/e70667eac4421fb462ca2d0ad4ddb670242293f7/src/filters/query-failed.filter.ts
 */
@Catch(QueryFailedError)
export class QueryFailedFilter extends BaseExceptionFilter {
  constructor(public reflector: Reflector) {
    super();
  }

  public override catch(
    exception: QueryFailedError & { constraint?: string },
    host: ArgumentsHost,
  ) {
    Logger.debug(JSON.stringify(exception, null, 2));
    Logger.error(exception.message);

    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    // const request = ctx.getRequest<Request>();

    const status = exception.constraint?.startsWith('UQ')
      ? HttpStatus.CONFLICT
      : HttpStatus.INTERNAL_SERVER_ERROR;

    // TODO: Update this to not return the DB-generated message
    const invalidKey = exception.message.split(':').pop()?.trim();

    response.status(status).json({
      error: STATUS_CODES[status],
      message: exception.constraint
        ? `Value for '${invalidKey}' already exists, try again`
        : undefined,
    });

    // if (exception.message.includes('UNIQUE')) {
    //   const invalidKey = exception.message.split(':').pop()?.trim();
    //   response.status(401).json({
    //     error: `Unique constraint failed`,
    //     message: `Value for '${invalidKey}' already exists, try again`,
    //   });
    // } else {
    //   response.status(500).json({
    //     statusCode: 500,
    //     path: request.url,
    //   });
    // }
  }
}
