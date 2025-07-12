import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse, provideHttpClient } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subject, from, of } from 'rxjs';

import { IGridConfiguration } from 'app/entities/gmodule/grid-configuration/grid-configuration.model';
import { GridConfigurationService } from 'app/entities/gmodule/grid-configuration/service/grid-configuration.service';
import { GridColumnService } from '../service/grid-column.service';
import { IGridColumn } from '../grid-column.model';
import { GridColumnFormService } from './grid-column-form.service';

import { GridColumnUpdateComponent } from './grid-column-update.component';

describe('GridColumn Management Update Component', () => {
  let comp: GridColumnUpdateComponent;
  let fixture: ComponentFixture<GridColumnUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let gridColumnFormService: GridColumnFormService;
  let gridColumnService: GridColumnService;
  let gridConfigurationService: GridConfigurationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [GridColumnUpdateComponent],
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
      .overrideTemplate(GridColumnUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(GridColumnUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    gridColumnFormService = TestBed.inject(GridColumnFormService);
    gridColumnService = TestBed.inject(GridColumnService);
    gridConfigurationService = TestBed.inject(GridConfigurationService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('should call GridConfiguration query and add missing value', () => {
      const gridColumn: IGridColumn = { id: 26575 };
      const gridConfiguration: IGridConfiguration = { id: 18742 };
      gridColumn.gridConfiguration = gridConfiguration;

      const gridConfigurationCollection: IGridConfiguration[] = [{ id: 18742 }];
      jest.spyOn(gridConfigurationService, 'query').mockReturnValue(of(new HttpResponse({ body: gridConfigurationCollection })));
      const additionalGridConfigurations = [gridConfiguration];
      const expectedCollection: IGridConfiguration[] = [...additionalGridConfigurations, ...gridConfigurationCollection];
      jest.spyOn(gridConfigurationService, 'addGridConfigurationToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ gridColumn });
      comp.ngOnInit();

      expect(gridConfigurationService.query).toHaveBeenCalled();
      expect(gridConfigurationService.addGridConfigurationToCollectionIfMissing).toHaveBeenCalledWith(
        gridConfigurationCollection,
        ...additionalGridConfigurations.map(expect.objectContaining),
      );
      expect(comp.gridConfigurationsSharedCollection).toEqual(expectedCollection);
    });

    it('should update editForm', () => {
      const gridColumn: IGridColumn = { id: 26575 };
      const gridConfiguration: IGridConfiguration = { id: 18742 };
      gridColumn.gridConfiguration = gridConfiguration;

      activatedRoute.data = of({ gridColumn });
      comp.ngOnInit();

      expect(comp.gridConfigurationsSharedCollection).toContainEqual(gridConfiguration);
      expect(comp.gridColumn).toEqual(gridColumn);
    });
  });

  describe('save', () => {
    it('should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IGridColumn>>();
      const gridColumn = { id: 15689 };
      jest.spyOn(gridColumnFormService, 'getGridColumn').mockReturnValue(gridColumn);
      jest.spyOn(gridColumnService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ gridColumn });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: gridColumn }));
      saveSubject.complete();

      // THEN
      expect(gridColumnFormService.getGridColumn).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(gridColumnService.update).toHaveBeenCalledWith(expect.objectContaining(gridColumn));
      expect(comp.isSaving).toEqual(false);
    });

    it('should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IGridColumn>>();
      const gridColumn = { id: 15689 };
      jest.spyOn(gridColumnFormService, 'getGridColumn').mockReturnValue({ id: null });
      jest.spyOn(gridColumnService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ gridColumn: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: gridColumn }));
      saveSubject.complete();

      // THEN
      expect(gridColumnFormService.getGridColumn).toHaveBeenCalled();
      expect(gridColumnService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IGridColumn>>();
      const gridColumn = { id: 15689 };
      jest.spyOn(gridColumnService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ gridColumn });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(gridColumnService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareGridConfiguration', () => {
      it('should forward to gridConfigurationService', () => {
        const entity = { id: 18742 };
        const entity2 = { id: 12340 };
        jest.spyOn(gridConfigurationService, 'compareGridConfiguration');
        comp.compareGridConfiguration(entity, entity2);
        expect(gridConfigurationService.compareGridConfiguration).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
