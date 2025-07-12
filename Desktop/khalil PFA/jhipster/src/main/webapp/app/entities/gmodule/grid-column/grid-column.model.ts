import { IGridConfiguration } from 'app/entities/gmodule/grid-configuration/grid-configuration.model';

export interface IGridColumn {
  id: number;
  dataField?: string | null;
  caption?: string | null;
  visible?: boolean | null;
  dataType?: string | null;
  format?: string | null;
  width?: number | null;
  allowSorting?: boolean | null;
  allowFiltering?: boolean | null;
  gridConfiguration?: Pick<IGridConfiguration, 'id' | 'gridName'> | null;
}

export type NewGridColumn = Omit<IGridColumn, 'id'> & { id: null };
