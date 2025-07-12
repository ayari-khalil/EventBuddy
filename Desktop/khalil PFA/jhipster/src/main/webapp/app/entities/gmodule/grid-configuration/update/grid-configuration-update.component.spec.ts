import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse, provideHttpClient } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subject, from, of } from 'rxjs';

import { GridConfigurationService } from '../service/grid-configuration.service';
import { IGridConfiguration } from '../grid-configuration.model';
import { GridConfigurationFormService } from './grid-configuration-form.service';

import { GridConfigurationUpdateComponent } from './grid-configuration-update.component';

describe('GridConfiguration Management Update Component', () => {
  let comp: GridConfigurationUpdateComponent;
  let fixture: ComponentFixture<GridConfigurationUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let gridConfigurationFormService: GridConfigurationFormService;
  let gridConfigurationService: GridConfigurationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [GridConfigurationUpdateComponent],
      providers: [
        provideHttpClient(),
        FormBuilder,
        {
          provide: ActivatedRoute,
          useValue: {
            params: from([{}]),
          },
        },
      ],
    })
      .overrideTemplate(GridConfigurationUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(GridConfigurationUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    gridConfigurationFormService = TestBed.inject(GridConfigurationFormService);
    gridConfigurationService = TestBed.inject(GridConfigurationService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('should update editForm', () => {
      const gridConfiguration: IGridConfiguration = { id: 12340 };

      activatedRoute.data = of({ gridConfiguration });
      comp.ngOnInit();

      expect(comp.gridConfiguration).toEqual(gridConfiguration);
    });
  });

  describe('save', () => {
    it('should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IGridConfiguration>>();
      const gridConfiguration = { id: 18742 };
      jest.spyOn(gridConfigurationFormService, 'getGridConfiguration').mockReturnValue(gridConfiguration);
      jest.spyOn(gridConfigurationService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ gridConfiguration });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: gridConfiguration }));
      saveSubject.complete();

      // THEN
      expect(gridConfigurationFormService.getGridConfiguration).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(gridConfigurationService.update).toHaveBeenCalledWith(expect.objectContaining(gridConfiguration));
      expect(comp.isSaving).toEqual(false);
    });

    it('should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IGridConfiguration>>();
      const gridConfiguration = { id: 18742 };
      jest.spyOn(gridConfigurationFormService, 'getGridConfiguration').mockReturnValue({ id: null });
      jest.spyOn(gridConfigurationService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ gridConfiguration: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: gridConfiguration }));
      saveSubject.complete();

      // THEN
      expect(gridConfigurationFormService.getGridConfiguration).toHaveBeenCalled();
      expect(gridConfigurationService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IGridConfiguration>>();
      const gridConfiguration = { id: 18742 };
      jest.spyOn(gridConfigurationService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ gridConfiguration });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(gridConfigurationService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
