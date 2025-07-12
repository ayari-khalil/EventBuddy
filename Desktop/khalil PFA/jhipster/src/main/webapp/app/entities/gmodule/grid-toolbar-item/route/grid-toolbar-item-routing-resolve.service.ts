import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { EMPTY, Observable, of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IGridToolbarItem } from '../grid-toolbar-item.model';
import { GridToolbarItemService } from '../service/grid-toolbar-item.service';

const gridToolbarItemResolve = (route: ActivatedRouteSnapshot): Observable<null | IGridToolbarItem> => {
  const id = route.params.id;
  if (id) {
    return inject(GridToolbarItemService)
      .find(id)
      .pipe(
        mergeMap((gridToolbarItem: HttpResponse<IGridToolbarItem>) => {
          if (gridToolbarItem.body) {
            return of(gridToolbarItem.body);
          }
          inject(Router).navigate(['404']);
          return EMPTY;
        }),
      );
  }
  return of(null);
};

export default gridToolbarItemResolve;
