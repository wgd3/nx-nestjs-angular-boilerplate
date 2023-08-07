/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import {
  ClassSerializerInterceptor,
  HttpStatus,
  Logger,
  ValidationPipe,
} from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';

import { AppModule } from './app/app.module';
import { QueryFailedFilter } from '@libs/server/util-common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableVersioning();

  const reflector = app.get(Reflector);

  app.useGlobalFilters(new QueryFailedFilter(reflector));

  app.useGlobalInterceptors(new ClassSerializerInterceptor(reflector));

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
      transform: true,
    })
  );

  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);
  const port = process.env.PORT || 3000;
  await app.listen(port);
  Logger.log(
    `🚀 Application is running on: http://localhost:${port}/${globalPrefix}`
  );
}

bootstrap();
