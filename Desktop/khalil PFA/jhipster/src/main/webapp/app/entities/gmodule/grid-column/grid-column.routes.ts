import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ASC } from 'app/config/navigation.constants';
import GridColumnResolve from './route/grid-column-routing-resolve.service';

const gridColumnRoute: Routes = [
  {
    path: '',
    loadComponent: () => import('./list/grid-column.component').then(m => m.GridColumnComponent),
    data: {
      defaultSort: `id,${ASC}`,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    loadComponent: () => import('./detail/grid-column-detail.component').then(m => m.GridColumnDetailComponent),
    resolve: {
      gridColumn: GridColumnResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    loadComponent: () => import('./update/grid-column-update.component').then(m => m.GridColumnUpdateComponent),
    resolve: {
      gridColumn: GridColumnResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    loadComponent: () => import('./update/grid-column-update.component').then(m => m.GridColumnUpdateComponent),
    resolve: {
      gridColumn: GridColumnResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default gridColumnRoute;
