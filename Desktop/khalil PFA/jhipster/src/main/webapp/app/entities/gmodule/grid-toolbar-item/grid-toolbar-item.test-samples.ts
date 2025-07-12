import { IGridToolbarItem, NewGridToolbarItem } from './grid-toolbar-item.model';

export const sampleWithRequiredData: IGridToolbarItem = {
  id: 24142,
};

export const sampleWithPartialData: IGridToolbarItem = {
  id: 26865,
  hint: 'turquoise',
};

export const sampleWithFullData: IGridToolbarItem = {
  id: 7507,
  location: 'dans la mesure où',
  widget: 'touchant',
  icon: 'alors que',
  text: 'puis insipide',
  hint: 'briller moderne de par',
  onClickAction: 'commis jamais touriste',
  visible: true,
};

export const sampleWithNewData: NewGridToolbarItem = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
