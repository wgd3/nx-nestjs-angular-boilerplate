import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { ROLES_REQUEST_KEY, SKIP_AUTH_KEY } from '../constants';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  /**
   * FIXME currently throws 401 unauthorized if roles don't match, should throw Forbidden instead
   * @param context
   * @returns
   */
  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.getAllAndOverride<string>(ROLES_REQUEST_KEY, [
      context.getClass(),
      context.getHandler(),
    ]);
    const skipAuth = this.reflector.getAllAndOverride<boolean>(SKIP_AUTH_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!roles.length || skipAuth) {
      return true;
    }
    const request = context.switchToHttp().getRequest();

    return roles.includes(request.user.role);
  }
}
