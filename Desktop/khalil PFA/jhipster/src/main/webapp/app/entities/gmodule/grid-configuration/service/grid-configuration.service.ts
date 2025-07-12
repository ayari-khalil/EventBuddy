import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable, map } from 'rxjs';

import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IGridConfiguration, NewGridConfiguration } from '../grid-configuration.model';

export type PartialUpdateGridConfiguration = Partial<IGridConfiguration> & Pick<IGridConfiguration, 'id'>;

type RestOf<T extends IGridConfiguration | NewGridConfiguration> = Omit<T, 'createdDate'> & {
  createdDate?: string | null;
};

export type RestGridConfiguration = RestOf<IGridConfiguration>;

export type NewRestGridConfiguration = RestOf<NewGridConfiguration>;

export type PartialUpdateRestGridConfiguration = RestOf<PartialUpdateGridConfiguration>;

export type EntityResponseType = HttpResponse<IGridConfiguration>;
export type EntityArrayResponseType = HttpResponse<IGridConfiguration[]>;

@Injectable({ providedIn: 'root' })
export class GridConfigurationService {
  protected readonly http = inject(HttpClient);
  protected readonly applicationConfigService = inject(ApplicationConfigService);

  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/grid-configurations', 'gmodule');

  create(gridConfiguration: NewGridConfiguration): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(gridConfiguration);
    return this.http
      .post<RestGridConfiguration>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(gridConfiguration: IGridConfiguration): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(gridConfiguration);
    return this.http
      .put<RestGridConfiguration>(`${this.resourceUrl}/${this.getGridConfigurationIdentifier(gridConfiguration)}`, copy, {
        observe: 'response',
      })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(gridConfiguration: PartialUpdateGridConfiguration): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(gridConfiguration);
    return this.http
      .patch<RestGridConfiguration>(`${this.resourceUrl}/${this.getGridConfigurationIdentifier(gridConfiguration)}`, copy, {
        observe: 'response',
      })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestGridConfiguration>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestGridConfiguration[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getGridConfigurationIdentifier(gridConfiguration: Pick<IGridConfiguration, 'id'>): number {
    return gridConfiguration.id;
  }

  compareGridConfiguration(o1: Pick<IGridConfiguration, 'id'> | null, o2: Pick<IGridConfiguration, 'id'> | null): boolean {
    return o1 && o2 ? this.getGridConfigurationIdentifier(o1) === this.getGridConfigurationIdentifier(o2) : o1 === o2;
  }

  addGridConfigurationToCollectionIfMissing<Type extends Pick<IGridConfiguration, 'id'>>(
    gridConfigurationCollection: Type[],
    ...gridConfigurationsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const gridConfigurations: Type[] = gridConfigurationsToCheck.filter(isPresent);
    if (gridConfigurations.length > 0) {
      const gridConfigurationCollectionIdentifiers = gridConfigurationCollection.map(gridConfigurationItem =>
        this.getGridConfigurationIdentifier(gridConfigurationItem),
      );
      const gridConfigurationsToAdd = gridConfigurations.filter(gridConfigurationItem => {
        const gridConfigurationIdentifier = this.getGridConfigurationIdentifier(gridConfigurationItem);
        if (gridConfigurationCollectionIdentifiers.includes(gridConfigurationIdentifier)) {
          return false;
        }
        gridConfigurationCollectionIdentifiers.push(gridConfigurationIdentifier);
        return true;
      });
      return [...gridConfigurationsToAdd, ...gridConfigurationCollection];
    }
    return gridConfigurationCollection;
  }

  protected convertDateFromClient<T extends IGridConfiguration | NewGridConfiguration | PartialUpdateGridConfiguration>(
    gridConfiguration: T,
  ): RestOf<T> {
    return {
      ...gridConfiguration,
      createdDate: gridConfiguration.createdDate?.toJSON() ?? null,
    };
  }

  protected convertDateFromServer(restGridConfiguration: RestGridConfiguration): IGridConfiguration {
    return {
      ...restGridConfiguration,
      createdDate: restGridConfiguration.createdDate ? dayjs(restGridConfiguration.createdDate) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestGridConfiguration>): HttpResponse<IGridConfiguration> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestGridConfiguration[]>): HttpResponse<IGridConfiguration[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
}
