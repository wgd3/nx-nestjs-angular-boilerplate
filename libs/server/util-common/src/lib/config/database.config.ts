import {
  ENV_DATABASE_HOST,
  ENV_DATABASE_LOGGING_ENABLED,
  ENV_DATABASE_NAME,
  ENV_DATABASE_PASSWORD,
  ENV_DATABASE_PATH,
  ENV_DATABASE_PORT,
  ENV_DATABASE_SYNCHRONIZE,
  ENV_DATABASE_TYPE,
  ENV_DATABASE_USERNAME,
} from '@libs/shared/util-constants';
import { registerAs } from '@nestjs/config';

export const dbConfig = registerAs('db', () => ({
  type: process.env[ENV_DATABASE_TYPE],
  host: process.env[ENV_DATABASE_HOST],
  port: process.env[ENV_DATABASE_PORT],
  password: process.env[ENV_DATABASE_PASSWORD],
  name: process.env[ENV_DATABASE_NAME],
  path: process.env[ENV_DATABASE_PATH],
  username: process.env[ENV_DATABASE_USERNAME],
  synchronize: process.env[ENV_DATABASE_SYNCHRONIZE] === 'true',
  logging: process.env[ENV_DATABASE_LOGGING_ENABLED],
}));
