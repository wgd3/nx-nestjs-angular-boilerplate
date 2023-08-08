import { ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';

import { SKIP_AUTH_KEY } from '../constants';

@Injectable()
export class JwtAccessTokenGuard extends AuthGuard('jwt-access') {
  constructor(private reflector: Reflector) {
    super();
  }

  override canActivate(ctx: ExecutionContext) {
    const skipAuth = this.reflector.getAllAndOverride<boolean>(SKIP_AUTH_KEY, [
      ctx.getHandler(),
      ctx.getClass(),
    ]);
    return skipAuth ?? super.canActivate(ctx);
  }

  // override handleRequest(err: any, user: any, info: any) {
  //   if (info instanceof TokenExpiredError) {
  //     throw new ForbiddenException(
  //       'tokenExpired',
  //       StatusCodesList.TokenExpired
  //     );
  //   }
  //   if (err || !user) {
  //     throw err || new UnauthorizedException();
  //   }
  //   return user;
  // }
}
