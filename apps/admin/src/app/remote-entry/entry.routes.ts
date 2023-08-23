import { Route } from '@angular/router';
import { authGuard } from '@libs/frontend/data-access-common';

export const remoteRoutes: Route[] = [
  {
    path: '',
    // path: 'users',
    canActivateChild: [authGuard],
    loadChildren: () =>
      import('@libs/frontend/feature-admin-uers').then(
        (m) => m.frontendFeatureAdminUsersRoutes,
      ),
  },
  // { path: '', canActivate: [authGuard], component: RemoteEntryComponent },
];
