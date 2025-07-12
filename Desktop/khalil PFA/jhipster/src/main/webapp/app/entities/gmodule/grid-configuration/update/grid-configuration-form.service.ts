import { Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { IGridConfiguration, NewGridConfiguration } from '../grid-configuration.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IGridConfiguration for edit and NewGridConfigurationFormGroupInput for create.
 */
type GridConfigurationFormGroupInput = IGridConfiguration | PartialWithRequiredKeyOf<NewGridConfiguration>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends IGridConfiguration | NewGridConfiguration> = Omit<T, 'createdDate'> & {
  createdDate?: string | null;
};

type GridConfigurationFormRawValue = FormValueOf<IGridConfiguration>;

type NewGridConfigurationFormRawValue = FormValueOf<NewGridConfiguration>;

type GridConfigurationFormDefaults = Pick<
  NewGridConfiguration,
  | 'id'
  | 'pagerShowPageSizeSelector'
  | 'pagerShowNavigationButtons'
  | 'allowSorting'
  | 'allowFiltering'
  | 'filterRowVisible'
  | 'headerFilterVisible'
  | 'allowSearch'
  | 'searchPanelVisible'
  | 'allowColumnChooser'
  | 'columnChooserEnabled'
  | 'columnHidingEnabled'
  | 'allowExport'
  | 'exportEnabled'
  | 'allowGrouping'
  | 'groupPanelVisible'
  | 'allowColumnReordering'
  | 'allowColumnResizing'
  | 'selectionAllowSelectAll'
  | 'editingAllowAdding'
  | 'editingAllowUpdating'
  | 'editingAllowDeleting'
  | 'createdDate'
>;

type GridConfigurationFormGroupContent = {
  id: FormControl<GridConfigurationFormRawValue['id'] | NewGridConfiguration['id']>;
  gridName: FormControl<GridConfigurationFormRawValue['gridName']>;
  pageSize: FormControl<GridConfigurationFormRawValue['pageSize']>;
  pagerAllowedPageSizes: FormControl<GridConfigurationFormRawValue['pagerAllowedPageSizes']>;
  pagerShowPageSizeSelector: FormControl<GridConfigurationFormRawValue['pagerShowPageSizeSelector']>;
  pagerShowNavigationButtons: FormControl<GridConfigurationFormRawValue['pagerShowNavigationButtons']>;
  allowSorting: FormControl<GridConfigurationFormRawValue['allowSorting']>;
  sortingMode: FormControl<GridConfigurationFormRawValue['sortingMode']>;
  allowFiltering: FormControl<GridConfigurationFormRawValue['allowFiltering']>;
  filterRowVisible: FormControl<GridConfigurationFormRawValue['filterRowVisible']>;
  headerFilterVisible: FormControl<GridConfigurationFormRawValue['headerFilterVisible']>;
  allowSearch: FormControl<GridConfigurationFormRawValue['allowSearch']>;
  searchPanelVisible: FormControl<GridConfigurationFormRawValue['searchPanelVisible']>;
  searchPanelWidth: FormControl<GridConfigurationFormRawValue['searchPanelWidth']>;
  searchPanelPlaceholder: FormControl<GridConfigurationFormRawValue['searchPanelPlaceholder']>;
  allowColumnChooser: FormControl<GridConfigurationFormRawValue['allowColumnChooser']>;
  columnChooserEnabled: FormControl<GridConfigurationFormRawValue['columnChooserEnabled']>;
  columnHidingEnabled: FormControl<GridConfigurationFormRawValue['columnHidingEnabled']>;
  allowExport: FormControl<GridConfigurationFormRawValue['allowExport']>;
  exportEnabled: FormControl<GridConfigurationFormRawValue['exportEnabled']>;
  exportFileName: FormControl<GridConfigurationFormRawValue['exportFileName']>;
  allowGrouping: FormControl<GridConfigurationFormRawValue['allowGrouping']>;
  groupPanelVisible: FormControl<GridConfigurationFormRawValue['groupPanelVisible']>;
  allowColumnReordering: FormControl<GridConfigurationFormRawValue['allowColumnReordering']>;
  allowColumnResizing: FormControl<GridConfigurationFormRawValue['allowColumnResizing']>;
  selectionMode: FormControl<GridConfigurationFormRawValue['selectionMode']>;
  selectionAllowSelectAll: FormControl<GridConfigurationFormRawValue['selectionAllowSelectAll']>;
  selectionShowCheckBoxesMode: FormControl<GridConfigurationFormRawValue['selectionShowCheckBoxesMode']>;
  editingMode: FormControl<GridConfigurationFormRawValue['editingMode']>;
  editingAllowAdding: FormControl<GridConfigurationFormRawValue['editingAllowAdding']>;
  editingAllowUpdating: FormControl<GridConfigurationFormRawValue['editingAllowUpdating']>;
  editingAllowDeleting: FormControl<GridConfigurationFormRawValue['editingAllowDeleting']>;
  createdDate: FormControl<GridConfigurationFormRawValue['createdDate']>;
};

export type GridConfigurationFormGroup = FormGroup<GridConfigurationFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class GridConfigurationFormService {
  createGridConfigurationFormGroup(gridConfiguration: GridConfigurationFormGroupInput = { id: null }): GridConfigurationFormGroup {
    const gridConfigurationRawValue = this.convertGridConfigurationToGridConfigurationRawValue({
      ...this.getFormDefaults(),
      ...gridConfiguration,
    });
    return new FormGroup<GridConfigurationFormGroupContent>({
      id: new FormControl(
        { value: gridConfigurationRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      gridName: new FormControl(gridConfigurationRawValue.gridName, {
        validators: [Validators.required],
      }),
      pageSize: new FormControl(gridConfigurationRawValue.pageSize),
      pagerAllowedPageSizes: new FormControl(gridConfigurationRawValue.pagerAllowedPageSizes),
      pagerShowPageSizeSelector: new FormControl(gridConfigurationRawValue.pagerShowPageSizeSelector),
      pagerShowNavigationButtons: new FormControl(gridConfigurationRawValue.pagerShowNavigationButtons),
      allowSorting: new FormControl(gridConfigurationRawValue.allowSorting),
      sortingMode: new FormControl(gridConfigurationRawValue.sortingMode),
      allowFiltering: new FormControl(gridConfigurationRawValue.allowFiltering),
      filterRowVisible: new FormControl(gridConfigurationRawValue.filterRowVisible),
      headerFilterVisible: new FormControl(gridConfigurationRawValue.headerFilterVisible),
      allowSearch: new FormControl(gridConfigurationRawValue.allowSearch),
      searchPanelVisible: new FormControl(gridConfigurationRawValue.searchPanelVisible),
      searchPanelWidth: new FormControl(gridConfigurationRawValue.searchPanelWidth),
      searchPanelPlaceholder: new FormControl(gridConfigurationRawValue.searchPanelPlaceholder),
      allowColumnChooser: new FormControl(gridConfigurationRawValue.allowColumnChooser),
      columnChooserEnabled: new FormControl(gridConfigurationRawValue.columnChooserEnabled),
      columnHidingEnabled: new FormControl(gridConfigurationRawValue.columnHidingEnabled),
      allowExport: new FormControl(gridConfigurationRawValue.allowExport),
      exportEnabled: new FormControl(gridConfigurationRawValue.exportEnabled),
      exportFileName: new FormControl(gridConfigurationRawValue.exportFileName),
      allowGrouping: new FormControl(gridConfigurationRawValue.allowGrouping),
      groupPanelVisible: new FormControl(gridConfigurationRawValue.groupPanelVisible),
      allowColumnReordering: new FormControl(gridConfigurationRawValue.allowColumnReordering),
      allowColumnResizing: new FormControl(gridConfigurationRawValue.allowColumnResizing),
      selectionMode: new FormControl(gridConfigurationRawValue.selectionMode),
      selectionAllowSelectAll: new FormControl(gridConfigurationRawValue.selectionAllowSelectAll),
      selectionShowCheckBoxesMode: new FormControl(gridConfigurationRawValue.selectionShowCheckBoxesMode),
      editingMode: new FormControl(gridConfigurationRawValue.editingMode),
      editingAllowAdding: new FormControl(gridConfigurationRawValue.editingAllowAdding),
      editingAllowUpdating: new FormControl(gridConfigurationRawValue.editingAllowUpdating),
      editingAllowDeleting: new FormControl(gridConfigurationRawValue.editingAllowDeleting),
      createdDate: new FormControl(gridConfigurationRawValue.createdDate),
    });
  }

  getGridConfiguration(form: GridConfigurationFormGroup): IGridConfiguration | NewGridConfiguration {
    return this.convertGridConfigurationRawValueToGridConfiguration(
      form.getRawValue() as GridConfigurationFormRawValue | NewGridConfigurationFormRawValue,
    );
  }

  resetForm(form: GridConfigurationFormGroup, gridConfiguration: GridConfigurationFormGroupInput): void {
    const gridConfigurationRawValue = this.convertGridConfigurationToGridConfigurationRawValue({
      ...this.getFormDefaults(),
      ...gridConfiguration,
    });
    form.reset(
      {
        ...gridConfigurationRawValue,
        id: { value: gridConfigurationRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): GridConfigurationFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      pagerShowPageSizeSelector: false,
      pagerShowNavigationButtons: false,
      allowSorting: false,
      allowFiltering: false,
      filterRowVisible: false,
      headerFilterVisible: false,
      allowSearch: false,
      searchPanelVisible: false,
      allowColumnChooser: false,
      columnChooserEnabled: false,
      columnHidingEnabled: false,
      allowExport: false,
      exportEnabled: false,
      allowGrouping: false,
      groupPanelVisible: false,
      allowColumnReordering: false,
      allowColumnResizing: false,
      selectionAllowSelectAll: false,
      editingAllowAdding: false,
      editingAllowUpdating: false,
      editingAllowDeleting: false,
      createdDate: currentTime,
    };
  }

  private convertGridConfigurationRawValueToGridConfiguration(
    rawGridConfiguration: GridConfigurationFormRawValue | NewGridConfigurationFormRawValue,
  ): IGridConfiguration | NewGridConfiguration {
    return {
      ...rawGridConfiguration,
      createdDate: dayjs(rawGridConfiguration.createdDate, DATE_TIME_FORMAT),
    };
  }

  private convertGridConfigurationToGridConfigurationRawValue(
    gridConfiguration: IGridConfiguration | (Partial<NewGridConfiguration> & GridConfigurationFormDefaults),
  ): GridConfigurationFormRawValue | PartialWithRequiredKeyOf<NewGridConfigurationFormRawValue> {
    return {
      ...gridConfiguration,
      createdDate: gridConfiguration.createdDate ? gridConfiguration.createdDate.format(DATE_TIME_FORMAT) : undefined,
    };
  }
}
