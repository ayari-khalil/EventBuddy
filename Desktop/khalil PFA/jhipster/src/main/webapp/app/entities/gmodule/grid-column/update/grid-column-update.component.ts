import { Component, OnInit, inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IGridConfiguration } from 'app/entities/gmodule/grid-configuration/grid-configuration.model';
import { GridConfigurationService } from 'app/entities/gmodule/grid-configuration/service/grid-configuration.service';
import { IGridColumn } from '../grid-column.model';
import { GridColumnService } from '../service/grid-column.service';
import { GridColumnFormGroup, GridColumnFormService } from './grid-column-form.service';

@Component({
  selector: 'jhi-grid-column-update',
  templateUrl: './grid-column-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class GridColumnUpdateComponent implements OnInit {
  isSaving = false;
  gridColumn: IGridColumn | null = null;

  gridConfigurationsSharedCollection: IGridConfiguration[] = [];

  protected gridColumnService = inject(GridColumnService);
  protected gridColumnFormService = inject(GridColumnFormService);
  protected gridConfigurationService = inject(GridConfigurationService);
  protected activatedRoute = inject(ActivatedRoute);

  // eslint-disable-next-line @typescript-eslint/member-ordering
  editForm: GridColumnFormGroup = this.gridColumnFormService.createGridColumnFormGroup();

  compareGridConfiguration = (o1: IGridConfiguration | null, o2: IGridConfiguration | null): boolean =>
    this.gridConfigurationService.compareGridConfiguration(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ gridColumn }) => {
      this.gridColumn = gridColumn;
      if (gridColumn) {
        this.updateForm(gridColumn);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const gridColumn = this.gridColumnFormService.getGridColumn(this.editForm);
    if (gridColumn.id !== null) {
      this.subscribeToSaveResponse(this.gridColumnService.update(gridColumn));
    } else {
      this.subscribeToSaveResponse(this.gridColumnService.create(gridColumn));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IGridColumn>>): void {
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

  protected updateForm(gridColumn: IGridColumn): void {
    this.gridColumn = gridColumn;
    this.gridColumnFormService.resetForm(this.editForm, gridColumn);

    this.gridConfigurationsSharedCollection = this.gridConfigurationService.addGridConfigurationToCollectionIfMissing<IGridConfiguration>(
      this.gridConfigurationsSharedCollection,
      gridColumn.gridConfiguration,
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
            this.gridColumn?.gridConfiguration,
          ),
        ),
      )
      .subscribe((gridConfigurations: IGridConfiguration[]) => (this.gridConfigurationsSharedCollection = gridConfigurations));
  }
}
