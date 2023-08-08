import { ServerFeatAuthModule } from '@libs/server/feat-auth';
import { ServerFeatUserModule } from '@libs/server/feat-user';
import {
  appConfig,
  dbConfig,
  QueryFailedFilter,
  TypeormConfigService,
  validationSchema,
} from '@libs/server/util-common';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_FILTER } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      load: [appConfig, dbConfig],
      validationSchema,
    }),
    TypeOrmModule.forRootAsync({
      useClass: TypeormConfigService,
      inject: [ConfigService],
    }),
    ServerFeatAuthModule,
    ServerFeatUserModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_FILTER,
      useClass: QueryFailedFilter,
    },
  ],
})
export class AppModule {}
