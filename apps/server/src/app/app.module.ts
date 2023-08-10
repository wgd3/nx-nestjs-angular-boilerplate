import { ServerFeatAuthModule } from '@libs/server/feat-auth';
import { ServerFeatureHealthModule } from '@libs/server/feat-health';
import { ServerFeatUserModule } from '@libs/server/feat-user';
import {
  appConfig,
  dbConfig,
  googleConfig,
  QueryFailedFilter,
  TypeormConfigService,
  validationSchema,
} from '@libs/server/util-common';
import { ENV_ENVIRONMENT, ENV_SENTRY_DSN } from '@libs/shared/util-constants';
import { HttpException, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { TerminusModule } from '@nestjs/terminus';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SentryInterceptor, SentryModule } from '@ntegral/nestjs-sentry';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      load: [appConfig, dbConfig, googleConfig],
      validationSchema,
    }),
    TypeOrmModule.forRootAsync({
      useClass: TypeormConfigService,
      inject: [ConfigService],
    }),
    SentryModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (cfg: ConfigService) => ({
        dsn: cfg.get(ENV_SENTRY_DSN),
        environment: cfg.get(ENV_ENVIRONMENT),
        enabled: !!cfg.get(ENV_SENTRY_DSN),
      }),
    }),
    TerminusModule.forRoot(),
    ServerFeatAuthModule,
    ServerFeatUserModule,
    ServerFeatureHealthModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_FILTER,
      useClass: QueryFailedFilter,
    },
    {
      provide: APP_INTERCEPTOR,
      useFactory: () =>
        new SentryInterceptor({
          filters: [
            {
              type: HttpException,
              filter: (exception: HttpException) =>
                exception.getStatus() >= 500,
            },
          ],
        }),
    },
  ],
})
export class AppModule {}
