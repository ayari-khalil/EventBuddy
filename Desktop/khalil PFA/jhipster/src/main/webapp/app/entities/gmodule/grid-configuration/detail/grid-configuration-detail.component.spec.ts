import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { of } from 'rxjs';

import { GridConfigurationDetailComponent } from './grid-configuration-detail.component';

describe('GridConfiguration Management Detail Component', () => {
  let comp: GridConfigurationDetailComponent;
  let fixture: ComponentFixture<GridConfigurationDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GridConfigurationDetailComponent],
      providers: [
        provideRouter(
          [
            {
              path: '**',
              loadComponent: () => import('./grid-configuration-detail.component').then(m => m.GridConfigurationDetailComponent),
              resolve: { gridConfiguration: () => of({ id: 18742 }) },
            },
          ],
          withComponentInputBinding(),
        ),
      ],
    })
      .overrideTemplate(GridConfigurationDetailComponent, '')
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GridConfigurationDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('should load gridConfiguration on init', async () => {
      const harness = await RouterTestingHarness.create();
      const instance = await harness.navigateByUrl('/', GridConfigurationDetailComponent);

      // THEN
      expect(instance.gridConfiguration()).toEqual(expect.objectContaining({ id: 18742 }));
    });
  });

  describe('PreviousState', () => {
    it('should navigate to previous state', () => {
      jest.spyOn(window.history, 'back');
      comp.previousState();
      expect(window.history.back).toHaveBeenCalled();
    });
  });
});
