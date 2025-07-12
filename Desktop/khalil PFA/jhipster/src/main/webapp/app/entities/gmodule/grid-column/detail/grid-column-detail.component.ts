import { Component, input } from '@angular/core';
import { RouterModule } from '@angular/router';

import SharedModule from 'app/shared/shared.module';
import { IGridColumn } from '../grid-column.model';

@Component({
  selector: 'jhi-grid-column-detail',
  templateUrl: './grid-column-detail.component.html',
  imports: [SharedModule, RouterModule],
})
export class GridColumnDetailComponent {
  gridColumn = input<IGridColumn | null>(null);

  previousState(): void {
    window.history.back();
  }
}
