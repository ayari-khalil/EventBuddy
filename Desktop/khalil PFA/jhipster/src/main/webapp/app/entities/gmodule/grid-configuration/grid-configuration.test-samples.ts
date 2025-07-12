import dayjs from 'dayjs/esm';

import { IGridConfiguration, NewGridConfiguration } from './grid-configuration.model';

export const sampleWithRequiredData: IGridConfiguration = {
  id: 6155,
  gridName: 'miaou bzzz',
};

export const sampleWithPartialData: IGridConfiguration = {
  id: 14833,
  gridName: 'rudement sur en decà de',
  pagerAllowedPageSizes: 'pourvu que crac ouille',
  pagerShowPageSizeSelector: true,
  allowSorting: false,
  sortingMode: 'toc grâce à absolument',
  allowSearch: false,
  searchPanelPlaceholder: 'minuscule',
  columnChooserEnabled: true,
  columnHidingEnabled: true,
  allowExport: false,
  exportEnabled: true,
  exportFileName: 'pourpre novice',
  allowColumnResizing: true,
  selectionMode: 'embarquer',
  editingAllowUpdating: true,
  createdDate: dayjs('2025-07-11T16:11'),
};

export const sampleWithFullData: IGridConfiguration = {
  id: 13481,
  gridName: 'membre du personnel solitaire assez',
  pageSize: 24517,
  pagerAllowedPageSizes: 'mieux gestionnaire bè',
  pagerShowPageSizeSelector: true,
  pagerShowNavigationButtons: false,
  allowSorting: true,
  sortingMode: 'abîmer',
  allowFiltering: false,
  filterRowVisible: false,
  headerFilterVisible: true,
  allowSearch: true,
  searchPanelVisible: false,
  searchPanelWidth: 1146,
  searchPanelPlaceholder: 'athlète large',
  allowColumnChooser: true,
  columnChooserEnabled: false,
  columnHidingEnabled: false,
  allowExport: false,
  exportEnabled: true,
  exportFileName: 'au-dessous de debout',
  allowGrouping: true,
  groupPanelVisible: false,
  allowColumnReordering: false,
  allowColumnResizing: true,
  selectionMode: 'à peu près en decà de rectangulaire',
  selectionAllowSelectAll: true,
  selectionShowCheckBoxesMode: 'détacher rapide secours',
  editingMode: 'de',
  editingAllowAdding: true,
  editingAllowUpdating: false,
  editingAllowDeleting: true,
  createdDate: dayjs('2025-07-12T03:05'),
};

export const sampleWithNewData: NewGridConfiguration = {
  gridName: 'terriblement',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
