import { Route } from '@angular/router';
import { authGuard } from '@libs/frontend/data-access-common';

import { RemoteEntryComponent } from './entry.component';

export const remoteRoutes: Route[] = [
  { path: '', canActivate: [authGuard], component: RemoteEntryComponent },
];
