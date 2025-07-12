import { Component, OnInit, inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IGridConfiguration } from 'app/entities/gmodule/grid-configuration/grid-configuration.model';
import { GridConfigurationService } from 'app/entities/gmodule/grid-configuration/service/grid-configuration.service';
import { IGridToolbarItem } from '../grid-toolbar-item.model';
import { GridToolbarItemService } from '../service/grid-toolbar-item.service';
import { GridToolbarItemFormGroup, GridToolbarItemFormService } from './grid-toolbar-item-form.service';

@Component({
  selector: 'jhi-grid-toolbar-item-update',
  templateUrl: './grid-toolbar-item-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class GridToolbarItemUpdateComponent implements OnInit {
  isSaving = false;
  gridToolbarItem: IGridToolbarItem | null = null;

  gridConfigurationsSharedCollection: IGridConfiguration[] = [];

  protected gridToolbarItemService = inject(GridToolbarItemService);
  protected gridToolbarItemFormService = inject(GridToolbarItemFormService);
  protected gridConfigurationService = inject(GridConfigurationService);
  protected activatedRoute = inject(ActivatedRoute);

  // eslint-disable-next-line @typescript-eslint/member-ordering
  editForm: GridToolbarItemFormGroup = this.gridToolbarItemFormService.createGridToolbarItemFormGroup();

  compareGridConfiguration = (o1: IGridConfiguration | null, o2: IGridConfiguration | null): boolean =>
    this.gridConfigurationService.compareGridConfiguration(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ gridToolbarItem }) => {
      this.gridToolbarItem = gridToolbarItem;
      if (gridToolbarItem) {
        this.updateForm(gridToolbarItem);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const gridToolbarItem = this.gridToolbarItemFormService.getGridToolbarItem(this.editForm);
    if (gridToolbarItem.id !== null) {
      this.subscribeToSaveResponse(this.gridToolbarItemService.update(gridToolbarItem));
    } else {
      this.subscribeToSaveResponse(this.gridToolbarItemService.create(gridToolbarItem));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IGridToolbarItem>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(gridToolbarItem: IGridToolbarItem): void {
    this.gridToolbarItem = gridToolbarItem;
    this.gridToolbarItemFormService.resetForm(this.editForm, gridToolbarItem);

    this.gridConfigurationsSharedCollection = this.gridConfigurationService.addGridConfigurationToCollectionIfMissing<IGridConfiguration>(
      this.gridConfigurationsSharedCollection,
      gridToolbarItem.gridConfiguration,
    );
  }

  protected loadRelationshipsOptions(): void {
    this.gridConfigurationService
      .query()
      .pipe(map((res: HttpResponse<IGridConfiguration[]>) => res.body ?? []))
      .pipe(
        map((gridConfigurations: IGridConfiguration[]) =>
          this.gridConfigurationService.addGridConfigurationToCollectionIfMissing<IGridConfiguration>(
            gridConfigurations,
            this.gridToolbarItem?.gridConfiguration,
          ),
        ),
      )
      .subscribe((gridConfigurations: IGridConfiguration[]) => (this.gridConfigurationsSharedCollection = gridConfigurations));
  }
}
