import {
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
} from '@libs/shared/util-constants';
import { registerAs } from '@nestjs/config';

import { CONFIG_NAMESPACE_MAILER } from '../constants';

export interface IMailerConfig {
  enabled: boolean;
  host: string;
  port: number;
  user: string;
  password: string;
  templateDir: string;
  ignoreTls: boolean;
  requireTls: boolean;
  secure: boolean;
  debug: boolean;
  defaultName: string;
  defaultEmail: string;
  partialsDir: string;
}

export const mailerConfig = registerAs(CONFIG_NAMESPACE_MAILER, () => ({
  enabled: process.env[ENV_EMAIL_ENABLED] === 'true',
  host: process.env[ENV_EMAIL_HOST] ?? '',
  port: process.env[ENV_EMAIL_PORT]
    ? parseInt(process.env[ENV_EMAIL_PORT])
    : 587,
  user: process.env[ENV_EMAIL_USER] ?? '',
  password: process.env[ENV_EMAIL_PASSWORD] ?? '',
  templateDir: process.env[ENV_EMAIL_TEMPLATE_DIR] ?? '',
  ignoreTls: !!process.env[ENV_EMAIL_IGNORE_TLS] ?? false,
  secure: !!process.env[ENV_EMAIL_SECURE] ?? true,
  requireTls: !!process.env[ENV_EMAIL_REQUIRE_TLS] ?? true,
  debug: !!process.env[ENV_EMAIL_DEBUG] ?? false,
  defaultName: process.env[ENV_EMAIL_DEFAULT_NAME] ?? '',
  defaultEmail: process.env[ENV_EMAIL_DEFAULT_EMAIL] ?? '',
  partialsDir: process.env[ENV_EMAIL_PARTIALS_DIR] ?? '',
}));
