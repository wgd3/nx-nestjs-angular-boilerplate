import { ExtractJwt, Strategy } from 'passport-jwt';

import { UserOrmEntity } from '@libs/server/data-access';
import { ServerFeatUserService } from '@libs/server/feat-user';
import { ENV_JWT_SECRET } from '@libs/shared/util-constants';
import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';

@Injectable()
export class JwtAccessStrategy extends PassportStrategy(
  Strategy,
  'jwt-access'
) {
  constructor(
    private configService: ConfigService,
    private userService: ServerFeatUserService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get(ENV_JWT_SECRET),
    });
  }

  /**
   * Called by @nestjs/passport automatically
   *
   * TODO: first arg is the JWT payload - need to create interface for payload
   * TODO: can other args be passed to `validate()`?
   */
  async validate(
    payload: any
    // role: RoleType,
    // tokenType: TokenType
  ): Promise<UserOrmEntity> {
    Logger.debug(`Validating user ${JSON.stringify(payload, null, 2)}`);

    const user = await this.userService.findUser({
      id: payload.sub,
      role: payload.role,
    });

    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
