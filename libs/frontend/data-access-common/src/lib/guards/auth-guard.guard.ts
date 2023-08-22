import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UserService } from '@libs/frontend/data-access-user';

import { REDIRECT_URL_QUERY_PARAM } from '../constants';

export const authGuard: CanActivateFn = (route, state) => {
  const userService = inject(UserService);
  const router = inject(Router);
  const expired = userService.tokenExpired;
  console.log(`[AuthGuard] token expired: ${expired}`);
  if (expired) {
    router.navigate(['/login'], {
      queryParams: { [REDIRECT_URL_QUERY_PARAM]: state.url },
    });
    return false;
  }
  return true;
};
