import { Route } from '@angular/router';
import { authGuard } from '@libs/frontend/data-access-common';

import { RemoteEntryComponent } from './entry.component';

export const remoteRoutes: Route[] = [
  {
    path: 'users',
    canActivateChild: [authGuard],
    loadChildren: () =>
      import('@libs/frontend/feature-admin-uers').then(
        (m) => m.frontendFeatureAdminUsersRoutes
      ),
  },
  { path: '', canActivate: [authGuard], component: RemoteEntryComponent },
];
