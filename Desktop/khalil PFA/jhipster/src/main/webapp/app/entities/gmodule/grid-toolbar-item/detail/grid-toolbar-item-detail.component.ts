import { Component, input } from '@angular/core';
import { RouterModule } from '@angular/router';

import SharedModule from 'app/shared/shared.module';
import { IGridToolbarItem } from '../grid-toolbar-item.model';

@Component({
  selector: 'jhi-grid-toolbar-item-detail',
  templateUrl: './grid-toolbar-item-detail.component.html',
  imports: [SharedModule, RouterModule],
})
export class GridToolbarItemDetailComponent {
  gridToolbarItem = input<IGridToolbarItem | null>(null);

  previousState(): void {
    window.history.back();
  }
}
