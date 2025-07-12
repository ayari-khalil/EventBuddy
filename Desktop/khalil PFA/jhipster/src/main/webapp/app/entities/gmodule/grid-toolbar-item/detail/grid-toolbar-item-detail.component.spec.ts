import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { of } from 'rxjs';

import { GridToolbarItemDetailComponent } from './grid-toolbar-item-detail.component';

describe('GridToolbarItem Management Detail Component', () => {
  let comp: GridToolbarItemDetailComponent;
  let fixture: ComponentFixture<GridToolbarItemDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GridToolbarItemDetailComponent],
      providers: [
        provideRouter(
          [
            {
              path: '**',
              loadComponent: () => import('./grid-toolbar-item-detail.component').then(m => m.GridToolbarItemDetailComponent),
              resolve: { gridToolbarItem: () => of({ id: 4194 }) },
            },
          ],
          withComponentInputBinding(),
        ),
      ],
    })
      .overrideTemplate(GridToolbarItemDetailComponent, '')
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GridToolbarItemDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('should load gridToolbarItem on init', async () => {
      const harness = await RouterTestingHarness.create();
      const instance = await harness.navigateByUrl('/', GridToolbarItemDetailComponent);

      // THEN
      expect(instance.gridToolbarItem()).toEqual(expect.objectContaining({ id: 4194 }));
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
