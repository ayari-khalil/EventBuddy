import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { EMPTY, Observable, of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IGridColumn } from '../grid-column.model';
import { GridColumnService } from '../service/grid-column.service';

const gridColumnResolve = (route: ActivatedRouteSnapshot): Observable<null | IGridColumn> => {
  const id = route.params.id;
  if (id) {
    return inject(GridColumnService)
      .find(id)
      .pipe(
        mergeMap((gridColumn: HttpResponse<IGridColumn>) => {
          if (gridColumn.body) {
            return of(gridColumn.body);
          }
          inject(Router).navigate(['404']);
          return EMPTY;
        }),
      );
  }
  return of(null);
};

export default gridColumnResolve;
