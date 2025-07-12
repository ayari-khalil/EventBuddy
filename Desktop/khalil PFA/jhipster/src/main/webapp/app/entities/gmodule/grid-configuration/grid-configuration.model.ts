import dayjs from 'dayjs/esm';

export interface IGridConfiguration {
  id: number;
  gridName?: string | null;
  pageSize?: number | null;
  pagerAllowedPageSizes?: string | null;
  pagerShowPageSizeSelector?: boolean | null;
  pagerShowNavigationButtons?: boolean | null;
  allowSorting?: boolean | null;
  sortingMode?: string | null;
  allowFiltering?: boolean | null;
  filterRowVisible?: boolean | null;
  headerFilterVisible?: boolean | null;
  allowSearch?: boolean | null;
  searchPanelVisible?: boolean | null;
  searchPanelWidth?: number | null;
  searchPanelPlaceholder?: string | null;
  allowColumnChooser?: boolean | null;
  columnChooserEnabled?: boolean | null;
  columnHidingEnabled?: boolean | null;
  allowExport?: boolean | null;
  exportEnabled?: boolean | null;
  exportFileName?: string | null;
  allowGrouping?: boolean | null;
  groupPanelVisible?: boolean | null;
  allowColumnReordering?: boolean | null;
  allowColumnResizing?: boolean | null;
  selectionMode?: string | null;
  selectionAllowSelectAll?: boolean | null;
  selectionShowCheckBoxesMode?: string | null;
  editingMode?: string | null;
  editingAllowAdding?: boolean | null;
  editingAllowUpdating?: boolean | null;
  editingAllowDeleting?: boolean | null;
  createdDate?: dayjs.Dayjs | null;
}

export type NewGridConfiguration = Omit<IGridConfiguration, 'id'> & { id: null };
