import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ASC } from 'app/config/navigation.constants';
import GridToolbarItemResolve from './route/grid-toolbar-item-routing-resolve.service';

const gridToolbarItemRoute: Routes = [
  {
    path: '',
    loadComponent: () => import('./list/grid-toolbar-item.component').then(m => m.GridToolbarItemComponent),
    data: {
      defaultSort: `id,${ASC}`,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    loadComponent: () => import('./detail/grid-toolbar-item-detail.component').then(m => m.GridToolbarItemDetailComponent),
    resolve: {
      gridToolbarItem: GridToolbarItemResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    loadComponent: () => import('./update/grid-toolbar-item-update.component').then(m => m.GridToolbarItemUpdateComponent),
    resolve: {
      gridToolbarItem: GridToolbarItemResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    loadComponent: () => import('./update/grid-toolbar-item-update.component').then(m => m.GridToolbarItemUpdateComponent),
    resolve: {
      gridToolbarItem: GridToolbarItemResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default gridToolbarItemRoute;
