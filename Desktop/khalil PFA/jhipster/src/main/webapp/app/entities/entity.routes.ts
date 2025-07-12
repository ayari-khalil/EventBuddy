import { Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'grid-configuration',
    data: { pageTitle: 'gmoduleApp.gmoduleGridConfiguration.home.title' },
    loadChildren: () => import('./gmodule/grid-configuration/grid-configuration.routes'),
  },
  {
    path: 'grid-column',
    data: { pageTitle: 'gmoduleApp.gmoduleGridColumn.home.title' },
    loadChildren: () => import('./gmodule/grid-column/grid-column.routes'),
  },
  {
    path: 'grid-toolbar-item',
    data: { pageTitle: 'gmoduleApp.gmoduleGridToolbarItem.home.title' },
    loadChildren: () => import('./gmodule/grid-toolbar-item/grid-toolbar-item.routes'),
  },
  /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
];

export default routes;
