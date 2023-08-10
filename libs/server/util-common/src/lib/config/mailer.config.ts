import {
  ENV_EMAIL_ENABLED,
  ENV_EMAIL_HOST,
  ENV_EMAIL_PASSWORD,
  ENV_EMAIL_PORT,
  ENV_EMAIL_TEMPLATE_DIR,
  ENV_EMAIL_USER,
} from '@libs/shared/util-constants';
import { registerAs } from '@nestjs/config';

export const mailerConfig = registerAs('app', () => ({
  enabled: process.env[ENV_EMAIL_ENABLED],
  host: process.env[ENV_EMAIL_HOST],
  port: process.env[ENV_EMAIL_PORT],
  user: process.env[ENV_EMAIL_USER],
  password: process.env[ENV_EMAIL_PASSWORD],
  templateDir: process.env[ENV_EMAIL_TEMPLATE_DIR],
}));
