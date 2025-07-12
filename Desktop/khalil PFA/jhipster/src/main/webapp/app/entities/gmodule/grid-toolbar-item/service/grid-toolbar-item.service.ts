import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IGridToolbarItem, NewGridToolbarItem } from '../grid-toolbar-item.model';

export type PartialUpdateGridToolbarItem = Partial<IGridToolbarItem> & Pick<IGridToolbarItem, 'id'>;

export type EntityResponseType = HttpResponse<IGridToolbarItem>;
export type EntityArrayResponseType = HttpResponse<IGridToolbarItem[]>;

@Injectable({ providedIn: 'root' })
export class GridToolbarItemService {
  protected readonly http = inject(HttpClient);
  protected readonly applicationConfigService = inject(ApplicationConfigService);

  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/grid-toolbar-items', 'gmodule');

  create(gridToolbarItem: NewGridToolbarItem): Observable<EntityResponseType> {
    return this.http.post<IGridToolbarItem>(this.resourceUrl, gridToolbarItem, { observe: 'response' });
  }

  update(gridToolbarItem: IGridToolbarItem): Observable<EntityResponseType> {
    return this.http.put<IGridToolbarItem>(`${this.resourceUrl}/${this.getGridToolbarItemIdentifier(gridToolbarItem)}`, gridToolbarItem, {
      observe: 'response',
    });
  }

  partialUpdate(gridToolbarItem: PartialUpdateGridToolbarItem): Observable<EntityResponseType> {
    return this.http.patch<IGridToolbarItem>(`${this.resourceUrl}/${this.getGridToolbarItemIdentifier(gridToolbarItem)}`, gridToolbarItem, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IGridToolbarItem>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IGridToolbarItem[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getGridToolbarItemIdentifier(gridToolbarItem: Pick<IGridToolbarItem, 'id'>): number {
    return gridToolbarItem.id;
  }

  compareGridToolbarItem(o1: Pick<IGridToolbarItem, 'id'> | null, o2: Pick<IGridToolbarItem, 'id'> | null): boolean {
    return o1 && o2 ? this.getGridToolbarItemIdentifier(o1) === this.getGridToolbarItemIdentifier(o2) : o1 === o2;
  }

  addGridToolbarItemToCollectionIfMissing<Type extends Pick<IGridToolbarItem, 'id'>>(
    gridToolbarItemCollection: Type[],
    ...gridToolbarItemsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const gridToolbarItems: Type[] = gridToolbarItemsToCheck.filter(isPresent);
    if (gridToolbarItems.length > 0) {
      const gridToolbarItemCollectionIdentifiers = gridToolbarItemCollection.map(gridToolbarItemItem =>
        this.getGridToolbarItemIdentifier(gridToolbarItemItem),
      );
      const gridToolbarItemsToAdd = gridToolbarItems.filter(gridToolbarItemItem => {
        const gridToolbarItemIdentifier = this.getGridToolbarItemIdentifier(gridToolbarItemItem);
        if (gridToolbarItemCollectionIdentifiers.includes(gridToolbarItemIdentifier)) {
          return false;
        }
        gridToolbarItemCollectionIdentifiers.push(gridToolbarItemIdentifier);
        return true;
      });
      return [...gridToolbarItemsToAdd, ...gridToolbarItemCollection];
    }
    return gridToolbarItemCollection;
  }
}
