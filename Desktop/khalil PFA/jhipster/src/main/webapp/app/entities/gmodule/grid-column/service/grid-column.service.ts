import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IGridColumn, NewGridColumn } from '../grid-column.model';

export type PartialUpdateGridColumn = Partial<IGridColumn> & Pick<IGridColumn, 'id'>;

export type EntityResponseType = HttpResponse<IGridColumn>;
export type EntityArrayResponseType = HttpResponse<IGridColumn[]>;

@Injectable({ providedIn: 'root' })
export class GridColumnService {
  protected readonly http = inject(HttpClient);
  protected readonly applicationConfigService = inject(ApplicationConfigService);

  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/grid-columns', 'gmodule');

  create(gridColumn: NewGridColumn): Observable<EntityResponseType> {
    return this.http.post<IGridColumn>(this.resourceUrl, gridColumn, { observe: 'response' });
  }

  update(gridColumn: IGridColumn): Observable<EntityResponseType> {
    return this.http.put<IGridColumn>(`${this.resourceUrl}/${this.getGridColumnIdentifier(gridColumn)}`, gridColumn, {
      observe: 'response',
    });
  }

  partialUpdate(gridColumn: PartialUpdateGridColumn): Observable<EntityResponseType> {
    return this.http.patch<IGridColumn>(`${this.resourceUrl}/${this.getGridColumnIdentifier(gridColumn)}`, gridColumn, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IGridColumn>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IGridColumn[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getGridColumnIdentifier(gridColumn: Pick<IGridColumn, 'id'>): number {
    return gridColumn.id;
  }

  compareGridColumn(o1: Pick<IGridColumn, 'id'> | null, o2: Pick<IGridColumn, 'id'> | null): boolean {
    return o1 && o2 ? this.getGridColumnIdentifier(o1) === this.getGridColumnIdentifier(o2) : o1 === o2;
  }

  addGridColumnToCollectionIfMissing<Type extends Pick<IGridColumn, 'id'>>(
    gridColumnCollection: Type[],
    ...gridColumnsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const gridColumns: Type[] = gridColumnsToCheck.filter(isPresent);
    if (gridColumns.length > 0) {
      const gridColumnCollectionIdentifiers = gridColumnCollection.map(gridColumnItem => this.getGridColumnIdentifier(gridColumnItem));
      const gridColumnsToAdd = gridColumns.filter(gridColumnItem => {
        const gridColumnIdentifier = this.getGridColumnIdentifier(gridColumnItem);
        if (gridColumnCollectionIdentifiers.includes(gridColumnIdentifier)) {
          return false;
        }
        gridColumnCollectionIdentifiers.push(gridColumnIdentifier);
        return true;
      });
      return [...gridColumnsToAdd, ...gridColumnCollection];
    }
    return gridColumnCollection;
  }
}
