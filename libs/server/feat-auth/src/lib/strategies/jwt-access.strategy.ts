import { ExtractJwt, Strategy } from 'passport-jwt';

import { UserOrmEntity } from '@libs/server/data-access';
import { ServerFeatUserService } from '@libs/server/feat-user';
import { ENV_JWT_SECRET } from '@libs/shared/util-constants';
import { Injectable, UnauthorizedException } from '@nestjs/common';
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
   * Method used by Passport - `payload` is the body of the (already
   * validated) JWT in the request. Any returned data is appended to the
   * request to assemble a `user` property.
   *
   */
  async validate(payload: any): Promise<UserOrmEntity> {
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
