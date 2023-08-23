import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

import { RoleType } from '@libs/shared/util-types';
import { ROLES_REQUEST_KEY, SKIP_AUTH_KEY } from '../constants';
import { RolesGuard } from '../guards/role.guard';
import { JwtAccessTokenGuard } from '../guards/jwt-access.guard';

/**
 * Automatically apply certain Swagger decorators, auth decorators, and
 * token/role guards to any controller method.
 */
export function Auth(
  roles: RoleType[] = [],
  opts?: Partial<{ public: boolean }>,
): MethodDecorator {
  return applyDecorators(
    SetMetadata(ROLES_REQUEST_KEY, roles),
    SetMetadata(SKIP_AUTH_KEY, opts?.public),
    UseGuards(JwtAccessTokenGuard, RolesGuard),
    ApiBearerAuth(),
    ApiUnauthorizedResponse({ description: 'Unauthorized' }),
    ApiForbiddenResponse({ description: `Forbidden` }),
    ApiInternalServerErrorResponse({ description: 'Unknown server error' }),
  );
}
