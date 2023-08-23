import { ExtractJwt, Strategy } from 'passport-jwt';

import { ServerFeatUserService } from '@libs/server/feat-user';
import { STRATEGY_JWT_ACCESS } from '@libs/server/util-common';
import { ENV_JWT_ACCESS_SECRET } from '@libs/shared/util-constants';
import { IJwtPayload, IRequestUserData } from '@libs/shared/util-types';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';

@Injectable()
export class JwtAccessStrategy extends PassportStrategy(
  Strategy,
  STRATEGY_JWT_ACCESS,
) {
  constructor(
    private configService: ConfigService,
    private userService: ServerFeatUserService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get(ENV_JWT_ACCESS_SECRET),
    });
  }

  /**
   * Method used by Passport - `payload` is the body of the (already
   * validated) JWT in the request. Any returned data is appended to the
   * request to assemble a `user` property.
   *
   */
  async validate(payload: IJwtPayload): Promise<IRequestUserData> {
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
    };
  }
}
