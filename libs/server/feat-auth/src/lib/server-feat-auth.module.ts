import { ServerFeatUserModule } from '@libs/server/feat-user';
import { STRATEGY_JWT_ACCESS } from '@libs/server/util-common';
import {
  ENV_JWT_ACCESS_EXPIRATION_TIME,
  ENV_JWT_ACCESS_SECRET,
  ENV_SOCIAL_GOOGLE_ENABLED,
} from '@libs/shared/util-constants';
import { forwardRef, Module, Provider } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { GoogleAuthController } from './google-auth/google-auth.controller';
import { GoogleAuthService } from './google-auth/google-auth.service';
import { ServerFeatAuthController } from './server-feat-auth.controller';
import { ServerFeatAuthService } from './server-feat-auth.service';
import { JwtAccessStrategy } from './strategies/jwt-access.strategy';
import { JwtRefreshStrategy } from './strategies/jwt-refresh.strategy';

const jwtStrategies: Provider[] = [JwtAccessStrategy, JwtRefreshStrategy];

const controllers = [
  ServerFeatAuthController,
  ...(process.env[ENV_SOCIAL_GOOGLE_ENABLED] === 'true'
    ? [GoogleAuthController]
    : []),
];

const services = [
  ServerFeatAuthService,
  ...(process.env[ENV_SOCIAL_GOOGLE_ENABLED] === 'true'
    ? [GoogleAuthService]
    : []),
];

@Module({
  imports: [
    ConfigModule,
    forwardRef(() => ServerFeatUserModule),
    PassportModule.register({ defaultStrategy: STRATEGY_JWT_ACCESS }),
    JwtModule.registerAsync({
      useFactory: (configService: ConfigService) => ({
        secret: configService.get(ENV_JWT_ACCESS_SECRET),
        signOptions: {
          expiresIn: configService.get(ENV_JWT_ACCESS_EXPIRATION_TIME),
        },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [...controllers],
  providers: [...jwtStrategies, ...services],
  exports: [
    ServerFeatAuthService,
    ...jwtStrategies,
    ...services,
    PassportModule,
  ],
})
export class ServerFeatAuthModule {}
