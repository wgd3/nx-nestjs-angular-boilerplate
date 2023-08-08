import { ServerFeatUserModule } from '@libs/server/feat-user';
import {
  ENV_JWT_ACCESS_EXPIRATION_TIME,
  ENV_JWT_SECRET,
} from '@libs/shared/util-constants';
import { forwardRef, Module, Provider } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { ServerFeatAuthController } from './server-feat-auth.controller';
import { ServerFeatAuthService } from './server-feat-auth.service';
import { JwtAccessStrategy } from './strategies/jwt-access.strategy';

const jwtStrategies: Provider[] = [JwtAccessStrategy, ServerFeatAuthService];

@Module({
  imports: [
    ConfigModule,
    forwardRef(() => ServerFeatUserModule),
    PassportModule.register({ defaultStrategy: 'jwt-access' }),
    JwtModule.registerAsync({
      useFactory: (configService: ConfigService) => ({
        secret: configService.get(ENV_JWT_SECRET),
        signOptions: {
          expiresIn: configService.get(ENV_JWT_ACCESS_EXPIRATION_TIME),
        },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [ServerFeatAuthController],
  providers: [...jwtStrategies],
  exports: [ServerFeatAuthService, ...jwtStrategies, PassportModule],
})
export class ServerFeatAuthModule {}
