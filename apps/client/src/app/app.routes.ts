import { Route } from '@angular/router';

export const appRoutes: Route[] = [
  {
    path: 'login',
    loadChildren: () =>
      import('@libs/frontend/feature-login').then(
        (m) => m.frontendFeatureLoginRoutes,
      ),
  },
];
