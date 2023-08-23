/* eslint-disable @typescript-eslint/no-explicit-any */
import { Observable } from 'rxjs';

import {
  ExecutionContext,
  ForbiddenException,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { STRATEGY_JWT_REFRESH } from '../constants';
import { TokenExpiredException } from '../exceptions';

@Injectable()
export class JwtRefreshTokenGuard extends AuthGuard(STRATEGY_JWT_REFRESH) {
  private logger = new Logger(JwtRefreshTokenGuard.name);
  constructor() {
    super();
  }

  override canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    // Add your custom authentication logic here
    // for example, call super.logIn(request) to establish a session.
    return super.canActivate(context);
  }

  override handleRequest(err: any, user: any, info: any) {
    if (info instanceof TokenExpiredException) {
      throw new ForbiddenException();
    }
    if (info || err || !user) {
      throw err || new UnauthorizedException();
    }
    return user;
  }
}
