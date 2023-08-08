import { ExtractJwt, Strategy } from 'passport-jwt';

import { UserOrmEntity } from '@libs/server/data-access';
import { ServerFeatUserService } from '@libs/server/feat-user';
import { ENV_JWT_SECRET } from '@libs/shared/util-constants';
import { RoleType, TokenType, Uuid } from '@libs/shared/util-types';
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

  async validate(
    userId: Uuid,
    role: RoleType,
    tokenType: TokenType
  ): Promise<UserOrmEntity> {
    if (tokenType !== TokenType.ACCESS_TOKEN) {
      throw new UnauthorizedException();
    }

    const user = await this.userService.findUser({ id: userId, role: role });

    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
