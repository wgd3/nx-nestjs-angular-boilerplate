import {
  ENV_SOCIAL_GOOGLE_CLIENT_ID,
  ENV_SOCIAL_GOOGLE_CLIENT_SECRET,
  ENV_SOCIAL_GOOGLE_ENABLED,
} from '@libs/shared/util-constants';
import { registerAs } from '@nestjs/config';

export const googleConfig = registerAs('google', () => ({
  enabled: process.env[ENV_SOCIAL_GOOGLE_ENABLED],
  clientId: process.env[ENV_SOCIAL_GOOGLE_CLIENT_ID],
  clientSecret: process.env[ENV_SOCIAL_GOOGLE_CLIENT_SECRET],
}));
