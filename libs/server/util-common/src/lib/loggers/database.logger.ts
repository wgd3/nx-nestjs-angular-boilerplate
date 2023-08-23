import { Logger as TypeOrmLogger } from 'typeorm';

import { Logger as NestLogger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

/**
 * Initially copied from https://wanago.io/2021/10/04/api-nestjs-logging-typeorm/
 */
export class DatabaseLogger implements TypeOrmLogger {
  private readonly logger = new NestLogger('TypeORM');

  constructor(private readonly configService: ConfigService) {}

  logQuery(query: string, parameters?: unknown[]) {
    if (query || parameters) {
      // do stuff!
    }
    // this.logger.debug(
    //   `${query} -- Parameters: ${this.stringifyParameters(parameters)}`
    // );
  }

  logQueryError(error: string, query: string, parameters?: unknown[]) {
    this.logger.error(
      `${query
        .split(',')
        .join(',\n')} -- Parameters: ${this.stringifyParameters(
        parameters,
      )} -- ${error}`,
    );
  }

  logQuerySlow(time: number, query: string, parameters?: unknown[]) {
    this.logger.warn(
      `Time: ${time} -- Parameters: ${this.stringifyParameters(
        parameters,
      )} -- ${query}`,
    );
  }

  logMigration(message: string) {
    this.logger.debug(message);
  }

  logSchemaBuild(message: string) {
    this.logger.debug(message);
  }

  log(level: 'log' | 'info' | 'warn', message: string) {
    if (level === 'log') {
      return this.logger.log(message);
    }
    if (level === 'info') {
      return this.logger.debug(message);
    }
    if (level === 'warn') {
      return this.logger.warn(message);
    }
  }

  private stringifyParameters(parameters?: unknown[]) {
    try {
      return JSON.stringify(parameters, null, 2);
    } catch {
      return '';
    }
  }
}
