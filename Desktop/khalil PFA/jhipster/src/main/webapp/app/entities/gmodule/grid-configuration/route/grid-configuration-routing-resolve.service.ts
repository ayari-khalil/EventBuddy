import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { EMPTY, Observable, of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IGridConfiguration } from '../grid-configuration.model';
import { GridConfigurationService } from '../service/grid-configuration.service';

const gridConfigurationResolve = (route: ActivatedRouteSnapshot): Observable<null | IGridConfiguration> => {
  const id = route.params.id;
  if (id) {
    return inject(GridConfigurationService)
      .find(id)
      .pipe(
        mergeMap((gridConfiguration: HttpResponse<IGridConfiguration>) => {
          if (gridConfiguration.body) {
            return of(gridConfiguration.body);
          }
          inject(Router).navigate(['404']);
          return EMPTY;
        }),
      );
  }
  return of(null);
};

export default gridConfigurationResolve;
