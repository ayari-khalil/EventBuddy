import { Component, input } from '@angular/core';
import { RouterModule } from '@angular/router';

import SharedModule from 'app/shared/shared.module';
import { FormatMediumDatetimePipe } from 'app/shared/date';
import { IGridConfiguration } from '../grid-configuration.model';

@Component({
  selector: 'jhi-grid-configuration-detail',
  templateUrl: './grid-configuration-detail.component.html',
  imports: [SharedModule, RouterModule, FormatMediumDatetimePipe],
})
export class GridConfigurationDetailComponent {
  gridConfiguration = input<IGridConfiguration | null>(null);

  previousState(): void {
    window.history.back();
  }
}
