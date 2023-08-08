import { ENV_SERVER_HOST, ENV_SERVER_PORT } from '@libs/shared/util-constants';
import { registerAs } from '@nestjs/config';

export const appConfig = registerAs('app', () => ({
  host: process.env[ENV_SERVER_HOST],
  port: process.env[ENV_SERVER_PORT],
}));
