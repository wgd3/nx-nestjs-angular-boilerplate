import * as Joi from 'joi';

import {
  ENV_API_PREFIX,
  ENV_API_VERSION,
  ENV_CORS_ORIGINS,
  ENV_DATABASE_HOST,
  ENV_DATABASE_LOGGING_ENABLED,
  ENV_DATABASE_NAME,
  ENV_DATABASE_PASSWORD,
  ENV_DATABASE_PATH,
  ENV_DATABASE_PORT,
  ENV_DATABASE_SYNCHRONIZE,
  ENV_DATABASE_TYPE,
  ENV_DATABASE_USERNAME,
  ENV_EMAIL_DEBUG,
  ENV_EMAIL_DEFAULT_EMAIL,
  ENV_EMAIL_DEFAULT_NAME,
  ENV_EMAIL_ENABLED,
  ENV_EMAIL_HOST,
  ENV_EMAIL_IGNORE_TLS,
  ENV_EMAIL_PARTIALS_DIR,
  ENV_EMAIL_PASSWORD,
  ENV_EMAIL_PORT,
  ENV_EMAIL_REQUIRE_TLS,
  ENV_EMAIL_SECURE,
  ENV_EMAIL_TEMPLATE_DIR,
  ENV_EMAIL_USER,
  ENV_ENABLE_SWAGGER,
  ENV_ENVIRONMENT,
  ENV_GENERATE_SWAGGER_JSON,
  ENV_JWT_ACCESS_EXPIRATION_TIME,
  ENV_JWT_ACCESS_SECRET,
  ENV_JWT_REFRESH_EXPIRATION_TIME,
  ENV_JWT_REFRESH_SECRET,
  ENV_SENTRY_DSN,
  ENV_SERVER_HOST,
  ENV_SERVER_PORT,
  ENV_SOCIAL_GOOGLE_CLIENT_ID,
  ENV_SOCIAL_GOOGLE_CLIENT_SECRET,
  ENV_SOCIAL_GOOGLE_ENABLED,
  ENV_SWAGGER_JSON_FILE,
} from '@libs/shared/util-constants';

export const validationSchema = Joi.object({
  // api config
  [ENV_API_VERSION]: Joi.string().default('v1'),
  [ENV_API_PREFIX]: Joi.string().default('api'),

  // swagger config
  [ENV_ENABLE_SWAGGER]: Joi.boolean().default(true),
  [ENV_GENERATE_SWAGGER_JSON]: Joi.boolean().default(false),
  [ENV_SWAGGER_JSON_FILE]: Joi.when(ENV_GENERATE_SWAGGER_JSON, {
    is: true,
    then: Joi.string(),
    otherwise: Joi.optional(),
  }),

  // app config
  [ENV_ENVIRONMENT]: Joi.string()
    .allow('development', 'production', 'local', 'test')
    .default('development'),
  [ENV_CORS_ORIGINS]: Joi.string().default('*'),
  [ENV_SERVER_HOST]: Joi.string().default('localhost'),
  [ENV_SERVER_PORT]: Joi.number().default(3333),
  [ENV_SENTRY_DSN]: Joi.string().optional(),

  // auth config
  [ENV_JWT_ACCESS_SECRET]: Joi.string().min(16).required(),
  [ENV_JWT_REFRESH_SECRET]: Joi.string().min(16).required(),
  [ENV_JWT_ACCESS_EXPIRATION_TIME]: Joi.string().default('3600s'),
  [ENV_JWT_REFRESH_EXPIRATION_TIME]: Joi.string().default('86400s'),

  // database config
  [ENV_DATABASE_TYPE]: Joi.string().default('sqlite'),
  [ENV_DATABASE_HOST]: Joi.when(ENV_DATABASE_TYPE, {
    is: 'sqlite',
    then: Joi.optional(),
    otherwise: Joi.string().required(),
  }),
  [ENV_DATABASE_PORT]: Joi.when(ENV_DATABASE_TYPE, {
    is: 'sqlite',
    then: Joi.optional(),
    otherwise: Joi.number().required(),
  }),
  [ENV_DATABASE_USERNAME]: Joi.when(ENV_DATABASE_TYPE, {
    is: 'sqlite',
    then: Joi.optional(),
    otherwise: Joi.string().required(),
  }),
  [ENV_DATABASE_PASSWORD]: Joi.when(ENV_DATABASE_TYPE, {
    is: 'sqlite',
    then: Joi.optional(),
    otherwise: Joi.string().required(),
  }),
  [ENV_DATABASE_NAME]: Joi.when(ENV_DATABASE_TYPE, {
    is: 'sqlite',
    then: Joi.optional(),
    otherwise: Joi.string().required(),
  }),
  [ENV_DATABASE_PATH]: Joi.when(ENV_DATABASE_TYPE, {
    is: 'sqlite',
    then: Joi.string().required(),
    otherwise: Joi.optional(),
  }),
  [ENV_DATABASE_LOGGING_ENABLED]: Joi.boolean().optional().default(false),
  [ENV_DATABASE_SYNCHRONIZE]: Joi.boolean().default(true),

  // mailer config
  [ENV_EMAIL_ENABLED]: Joi.boolean().default(false),
  [ENV_EMAIL_HOST]: Joi.when(ENV_EMAIL_ENABLED, {
    is: true,
    then: Joi.string().required(),
    otherwise: Joi.optional(),
  }),
  [ENV_EMAIL_PORT]: Joi.when(ENV_EMAIL_ENABLED, {
    is: true,
    then: Joi.number().required(),
    otherwise: Joi.optional(),
  }),
  [ENV_EMAIL_USER]: Joi.when(ENV_EMAIL_ENABLED, {
    is: true,
    then: Joi.string().required(),
    otherwise: Joi.optional(),
  }),
  [ENV_EMAIL_PASSWORD]: Joi.when(ENV_EMAIL_ENABLED, {
    is: true,
    then: Joi.string().required(),
    otherwise: Joi.optional(),
  }),
  [ENV_EMAIL_TEMPLATE_DIR]: Joi.when(ENV_EMAIL_ENABLED, {
    is: true,
    then: Joi.string().required(),
    otherwise: Joi.optional(),
  }),
  [ENV_EMAIL_PARTIALS_DIR]: Joi.when(ENV_EMAIL_ENABLED, {
    is: true,
    then: Joi.string().required(),
    otherwise: Joi.optional(),
  }),
  [ENV_EMAIL_IGNORE_TLS]: Joi.when(ENV_EMAIL_ENABLED, {
    is: true,
    then: Joi.boolean().required().default(false),
    otherwise: Joi.optional(),
  }),
  [ENV_EMAIL_REQUIRE_TLS]: Joi.when(ENV_EMAIL_ENABLED, {
    is: true,
    then: Joi.boolean().required().default(true),
    otherwise: Joi.optional(),
  }),
  [ENV_EMAIL_SECURE]: Joi.when(ENV_EMAIL_ENABLED, {
    is: true,
    then: Joi.boolean().required().default(true),
    otherwise: Joi.optional(),
  }),
  [ENV_EMAIL_DEBUG]: Joi.when(ENV_EMAIL_ENABLED, {
    is: true,
    then: Joi.boolean().required().default(false),
    otherwise: Joi.optional(),
  }),
  [ENV_EMAIL_DEFAULT_EMAIL]: Joi.when(ENV_EMAIL_ENABLED, {
    is: true,
    then: Joi.string().required(),
    otherwise: Joi.optional(),
  }),
  [ENV_EMAIL_DEFAULT_NAME]: Joi.when(ENV_EMAIL_ENABLED, {
    is: true,
    then: Joi.string().required(),
    otherwise: Joi.optional(),
  }),

  // social config
  [ENV_SOCIAL_GOOGLE_ENABLED]: Joi.boolean().optional().default(false),
  [ENV_SOCIAL_GOOGLE_CLIENT_ID]: Joi.when(ENV_SOCIAL_GOOGLE_ENABLED, {
    is: true,
    then: Joi.string().required(),
    otherwise: Joi.optional(),
  }),
  [ENV_SOCIAL_GOOGLE_CLIENT_SECRET]: Joi.when(ENV_SOCIAL_GOOGLE_ENABLED, {
    is: true,
    then: Joi.string().required(),
    otherwise: Joi.optional(),
  }),
});
