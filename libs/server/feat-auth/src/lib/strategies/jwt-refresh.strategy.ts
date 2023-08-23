import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { ServerFeatUserService } from '@libs/server/feat-user';
import { STRATEGY_JWT_REFRESH } from '@libs/server/util-common';
import { ENV_JWT_REFRESH_SECRET } from '@libs/shared/util-constants';
import { IJwtPayload, IRequestUserData } from '@libs/shared/util-types';
import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  STRATEGY_JWT_REFRESH,
) {
  private logger = new Logger(JwtRefreshStrategy.name);
  constructor(
    private configService: ConfigService,
    private userService: ServerFeatUserService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get(ENV_JWT_REFRESH_SECRET),
      passReqToCallback: true,
    });
  }

  async validate(
    req: Request,
    payload: IJwtPayload,
  ): Promise<IRequestUserData & { refreshToken: string }> {
    const refreshToken =
      req.get('Authorization')?.replace('Bearer', '').trim() ?? '';
    this.logger.debug(
      `Validating refresh token for ${payload.email}\n${refreshToken}`,
    );
    const user = await this.userService.findUser({
      id: payload.sub,
      role: payload.role,
    });

    if (!user) {
      throw new UnauthorizedException();
    }

    return {
      id: user.id,
      email: user.email,
      role: user.role,
      refreshToken,
    };
  }
}
