import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UserService } from '@libs/frontend/data-access-user';

export const authGuard: CanActivateFn = (route, state) => {
  const userService = inject(UserService);
  const router = inject(Router);
  const expired = userService.tokenExpired;
  console.log(`[AuthGuard] token expired: ${expired}`);
  if (expired) {
    router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
    return false;
  }
  return true;
};
