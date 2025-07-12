import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ASC } from 'app/config/navigation.constants';
import GridConfigurationResolve from './route/grid-configuration-routing-resolve.service';

const gridConfigurationRoute: Routes = [
  {
    path: '',
    loadComponent: () => import('./list/grid-configuration.component').then(m => m.GridConfigurationComponent),
    data: {
      defaultSort: `id,${ASC}`,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    loadComponent: () => import('./detail/grid-configuration-detail.component').then(m => m.GridConfigurationDetailComponent),
    resolve: {
      gridConfiguration: GridConfigurationResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    loadComponent: () => import('./update/grid-configuration-update.component').then(m => m.GridConfigurationUpdateComponent),
    resolve: {
      gridConfiguration: GridConfigurationResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    loadComponent: () => import('./update/grid-configuration-update.component').then(m => m.GridConfigurationUpdateComponent),
    resolve: {
      gridConfiguration: GridConfigurationResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default gridConfigurationRoute;
