import { IGridColumn, NewGridColumn } from './grid-column.model';

export const sampleWithRequiredData: IGridColumn = {
  id: 10679,
  dataField: 'déplacer pschitt',
};

export const sampleWithPartialData: IGridColumn = {
  id: 7523,
  dataField: 'de façon à ce que',
  caption: 'autant ouf ouah',
  dataType: 'quelquefois au cas où',
  format: 'si bien que',
};

export const sampleWithFullData: IGridColumn = {
  id: 8382,
  dataField: 'espiègle assez',
  caption: 'de façon à ce que puis développer',
  visible: true,
  dataType: 'présidence',
  format: 'pff',
  width: 8827,
  allowSorting: false,
  allowFiltering: true,
};

export const sampleWithNewData: NewGridColumn = {
  dataField: 'areu areu surveiller',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
