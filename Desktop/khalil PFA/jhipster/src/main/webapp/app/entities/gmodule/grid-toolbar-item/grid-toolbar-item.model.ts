import { IGridConfiguration } from 'app/entities/gmodule/grid-configuration/grid-configuration.model';

export interface IGridToolbarItem {
  id: number;
  location?: string | null;
  widget?: string | null;
  icon?: string | null;
  text?: string | null;
  hint?: string | null;
  onClickAction?: string | null;
  visible?: boolean | null;
  gridConfiguration?: Pick<IGridConfiguration, 'id' | 'gridName'> | null;
}

export type NewGridToolbarItem = Omit<IGridToolbarItem, 'id'> & { id: null };
