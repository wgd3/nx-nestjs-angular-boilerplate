import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { UserService } from '@libs/frontend/data-access-user';

export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  const accessToken = inject(UserService).accessToken;
  if (accessToken) {
    console.log(
      `[jwtInterceptor] Found access token: ${accessToken.slice(0, 12)}`,
    );
    req = req.clone({
      url: req.urlWithParams,
      setHeaders: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
  }
  return next(req);
};
