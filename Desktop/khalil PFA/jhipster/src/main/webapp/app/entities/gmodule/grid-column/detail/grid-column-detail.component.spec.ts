import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { of } from 'rxjs';

import { GridColumnDetailComponent } from './grid-column-detail.component';

describe('GridColumn Management Detail Component', () => {
  let comp: GridColumnDetailComponent;
  let fixture: ComponentFixture<GridColumnDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GridColumnDetailComponent],
      providers: [
        provideRouter(
          [
            {
              path: '**',
              loadComponent: () => import('./grid-column-detail.component').then(m => m.GridColumnDetailComponent),
              resolve: { gridColumn: () => of({ id: 15689 }) },
            },
          ],
          withComponentInputBinding(),
        ),
      ],
    })
      .overrideTemplate(GridColumnDetailComponent, '')
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GridColumnDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('should load gridColumn on init', async () => {
      const harness = await RouterTestingHarness.create();
      const instance = await harness.navigateByUrl('/', GridColumnDetailComponent);

      // THEN
      expect(instance.gridColumn()).toEqual(expect.objectContaining({ id: 15689 }));
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
