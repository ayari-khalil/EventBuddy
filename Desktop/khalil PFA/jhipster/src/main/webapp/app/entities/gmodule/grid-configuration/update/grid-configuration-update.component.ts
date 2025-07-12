import { Component, OnInit, inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IGridConfiguration } from '../grid-configuration.model';
import { GridConfigurationService } from '../service/grid-configuration.service';
import { GridConfigurationFormGroup, GridConfigurationFormService } from './grid-configuration-form.service';

@Component({
  selector: 'jhi-grid-configuration-update',
  templateUrl: './grid-configuration-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class GridConfigurationUpdateComponent implements OnInit {
  isSaving = false;
  gridConfiguration: IGridConfiguration | null = null;

  protected gridConfigurationService = inject(GridConfigurationService);
  protected gridConfigurationFormService = inject(GridConfigurationFormService);
  protected activatedRoute = inject(ActivatedRoute);

  // eslint-disable-next-line @typescript-eslint/member-ordering
  editForm: GridConfigurationFormGroup = this.gridConfigurationFormService.createGridConfigurationFormGroup();

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ gridConfiguration }) => {
      this.gridConfiguration = gridConfiguration;
      if (gridConfiguration) {
        this.updateForm(gridConfiguration);
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const gridConfiguration = this.gridConfigurationFormService.getGridConfiguration(this.editForm);
    if (gridConfiguration.id !== null) {
      this.subscribeToSaveResponse(this.gridConfigurationService.update(gridConfiguration));
    } else {
      this.subscribeToSaveResponse(this.gridConfigurationService.create(gridConfiguration));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IGridConfiguration>>): void {
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

  protected updateForm(gridConfiguration: IGridConfiguration): void {
    this.gridConfiguration = gridConfiguration;
    this.gridConfigurationFormService.resetForm(this.editForm, gridConfiguration);
  }
}
