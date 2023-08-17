import * as Joi from 'joi';
import * as request from 'supertest';

import { ServerFeatureHealthModule } from '@libs/server/feat-health';
import {
  ENV_DATABASE_LOGGING_ENABLED,
  ENV_DATABASE_PATH,
  ENV_ENVIRONMENT,
} from '@libs/shared/util-constants';
import { INestApplication, Logger, VersioningType } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';

describe('GET /api/v1/health', () => {
  let app: INestApplication;
  let configService: ConfigService;

  const healthUrl = `/api/v1/health`;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          envFilePath: '.env.testing',
          ignoreEnvVars: true,
          // load: [appConfig, dbConfig, googleConfig, mailerConfig],
          validationSchema: Joi.object({
            [ENV_DATABASE_PATH]: Joi.string().default(':memory:'),
            [ENV_DATABASE_LOGGING_ENABLED]: Joi.boolean().default(false),
            [ENV_ENVIRONMENT]: Joi.string().default('test'),
            NODE_ENV: Joi.string().default('test'),
            // JWT_ACCES_SECRET: Joi.string().default(randPassword({ size: 32 })),
          }),
        }),
        TypeOrmModule.forRootAsync({
          useFactory: (config: ConfigService) => {
            // make sure this is cast as a boolean
            const logging = !!config.get(ENV_DATABASE_LOGGING_ENABLED);
            const database = config.get(ENV_DATABASE_PATH);
            return {
              type: 'sqlite',
              database,
              logging,
              synchronize: true,
              autoLoadEntities: true,
            };
          },
          inject: [ConfigService],
        }),
        ServerFeatureHealthModule,
      ],
    })
      .setLogger(new Logger(`E2E Testing`))
      .compile();

    app = moduleRef.createNestApplication();

    app.setGlobalPrefix('/api');
    app.enableVersioning({
      type: VersioningType.URI,
      prefix: 'v',
    });

    /////////////////////////////////////////////
    // App Setup (main.ts-related stuff) goes
    // above this line!
    /////////////////////////////////////////////

    await app.init();

    configService = app.get(ConfigService);
  });

  afterAll(async () => {
    await app.close();
  });

  it('should have config service available', () => {
    expect(configService).toBeTruthy();
  });

  it('should return health', () => {
    return request.default(app.getHttpServer()).get(`${healthUrl}`).expect(200);
  });
});
