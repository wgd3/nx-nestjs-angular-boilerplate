/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';

import { SKIP_AUTH_KEY, STRATEGY_JWT_ACCESS } from '../constants';
import { TokenExpiredException } from '../exceptions';

@Injectable()
export class JwtAccessTokenGuard extends AuthGuard(STRATEGY_JWT_ACCESS) {
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

  override handleRequest(err: any, user: any, info: any) {
    if (info instanceof TokenExpiredException) {
      throw new ForbiddenException();
    }
    if (err || !user) {
      throw err || new UnauthorizedException();
    }
    return user;
  }
}
