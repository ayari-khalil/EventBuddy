import { Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { IGridColumn, NewGridColumn } from '../grid-column.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IGridColumn for edit and NewGridColumnFormGroupInput for create.
 */
type GridColumnFormGroupInput = IGridColumn | PartialWithRequiredKeyOf<NewGridColumn>;

type GridColumnFormDefaults = Pick<NewGridColumn, 'id' | 'visible' | 'allowSorting' | 'allowFiltering'>;

type GridColumnFormGroupContent = {
  id: FormControl<IGridColumn['id'] | NewGridColumn['id']>;
  dataField: FormControl<IGridColumn['dataField']>;
  caption: FormControl<IGridColumn['caption']>;
  visible: FormControl<IGridColumn['visible']>;
  dataType: FormControl<IGridColumn['dataType']>;
  format: FormControl<IGridColumn['format']>;
  width: FormControl<IGridColumn['width']>;
  allowSorting: FormControl<IGridColumn['allowSorting']>;
  allowFiltering: FormControl<IGridColumn['allowFiltering']>;
  gridConfiguration: FormControl<IGridColumn['gridConfiguration']>;
};

export type GridColumnFormGroup = FormGroup<GridColumnFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class GridColumnFormService {
  createGridColumnFormGroup(gridColumn: GridColumnFormGroupInput = { id: null }): GridColumnFormGroup {
    const gridColumnRawValue = {
      ...this.getFormDefaults(),
      ...gridColumn,
    };
    return new FormGroup<GridColumnFormGroupContent>({
      id: new FormControl(
        { value: gridColumnRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      dataField: new FormControl(gridColumnRawValue.dataField, {
        validators: [Validators.required],
      }),
      caption: new FormControl(gridColumnRawValue.caption),
      visible: new FormControl(gridColumnRawValue.visible),
      dataType: new FormControl(gridColumnRawValue.dataType),
      format: new FormControl(gridColumnRawValue.format),
      width: new FormControl(gridColumnRawValue.width),
      allowSorting: new FormControl(gridColumnRawValue.allowSorting),
      allowFiltering: new FormControl(gridColumnRawValue.allowFiltering),
      gridConfiguration: new FormControl(gridColumnRawValue.gridConfiguration),
    });
  }

  getGridColumn(form: GridColumnFormGroup): IGridColumn | NewGridColumn {
    return form.getRawValue() as IGridColumn | NewGridColumn;
  }

  resetForm(form: GridColumnFormGroup, gridColumn: GridColumnFormGroupInput): void {
    const gridColumnRawValue = { ...this.getFormDefaults(), ...gridColumn };
    form.reset(
      {
        ...gridColumnRawValue,
        id: { value: gridColumnRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): GridColumnFormDefaults {
    return {
      id: null,
      visible: false,
      allowSorting: false,
      allowFiltering: false,
    };
  }
}
