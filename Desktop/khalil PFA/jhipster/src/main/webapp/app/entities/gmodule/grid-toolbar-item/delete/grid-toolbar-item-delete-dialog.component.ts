import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';
import { IGridToolbarItem } from '../grid-toolbar-item.model';
import { GridToolbarItemService } from '../service/grid-toolbar-item.service';

@Component({
  templateUrl: './grid-toolbar-item-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class GridToolbarItemDeleteDialogComponent {
  gridToolbarItem?: IGridToolbarItem;

  protected gridToolbarItemService = inject(GridToolbarItemService);
  protected activeModal = inject(NgbActiveModal);

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.gridToolbarItemService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
