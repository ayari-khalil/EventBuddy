import { Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { IGridToolbarItem, NewGridToolbarItem } from '../grid-toolbar-item.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IGridToolbarItem for edit and NewGridToolbarItemFormGroupInput for create.
 */
type GridToolbarItemFormGroupInput = IGridToolbarItem | PartialWithRequiredKeyOf<NewGridToolbarItem>;

type GridToolbarItemFormDefaults = Pick<NewGridToolbarItem, 'id' | 'visible'>;

type GridToolbarItemFormGroupContent = {
  id: FormControl<IGridToolbarItem['id'] | NewGridToolbarItem['id']>;
  location: FormControl<IGridToolbarItem['location']>;
  widget: FormControl<IGridToolbarItem['widget']>;
  icon: FormControl<IGridToolbarItem['icon']>;
  text: FormControl<IGridToolbarItem['text']>;
  hint: FormControl<IGridToolbarItem['hint']>;
  onClickAction: FormControl<IGridToolbarItem['onClickAction']>;
  visible: FormControl<IGridToolbarItem['visible']>;
  gridConfiguration: FormControl<IGridToolbarItem['gridConfiguration']>;
};

export type GridToolbarItemFormGroup = FormGroup<GridToolbarItemFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class GridToolbarItemFormService {
  createGridToolbarItemFormGroup(gridToolbarItem: GridToolbarItemFormGroupInput = { id: null }): GridToolbarItemFormGroup {
    const gridToolbarItemRawValue = {
      ...this.getFormDefaults(),
      ...gridToolbarItem,
    };
    return new FormGroup<GridToolbarItemFormGroupContent>({
      id: new FormControl(
        { value: gridToolbarItemRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      location: new FormControl(gridToolbarItemRawValue.location),
      widget: new FormControl(gridToolbarItemRawValue.widget),
      icon: new FormControl(gridToolbarItemRawValue.icon),
      text: new FormControl(gridToolbarItemRawValue.text),
      hint: new FormControl(gridToolbarItemRawValue.hint),
      onClickAction: new FormControl(gridToolbarItemRawValue.onClickAction),
      visible: new FormControl(gridToolbarItemRawValue.visible),
      gridConfiguration: new FormControl(gridToolbarItemRawValue.gridConfiguration),
    });
  }

  getGridToolbarItem(form: GridToolbarItemFormGroup): IGridToolbarItem | NewGridToolbarItem {
    return form.getRawValue() as IGridToolbarItem | NewGridToolbarItem;
  }

  resetForm(form: GridToolbarItemFormGroup, gridToolbarItem: GridToolbarItemFormGroupInput): void {
    const gridToolbarItemRawValue = { ...this.getFormDefaults(), ...gridToolbarItem };
    form.reset(
      {
        ...gridToolbarItemRawValue,
        id: { value: gridToolbarItemRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): GridToolbarItemFormDefaults {
    return {
      id: null,
      visible: false,
    };
  }
}
