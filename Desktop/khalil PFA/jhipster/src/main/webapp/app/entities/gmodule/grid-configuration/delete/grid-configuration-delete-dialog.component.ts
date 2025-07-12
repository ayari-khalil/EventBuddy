import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';
import { IGridConfiguration } from '../grid-configuration.model';
import { GridConfigurationService } from '../service/grid-configuration.service';

@Component({
  templateUrl: './grid-configuration-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class GridConfigurationDeleteDialogComponent {
  gridConfiguration?: IGridConfiguration;

  protected gridConfigurationService = inject(GridConfigurationService);
  protected activeModal = inject(NgbActiveModal);

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.gridConfigurationService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
