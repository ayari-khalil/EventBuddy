import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse, provideHttpClient } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subject, from, of } from 'rxjs';

import { IGridConfiguration } from 'app/entities/gmodule/grid-configuration/grid-configuration.model';
import { GridConfigurationService } from 'app/entities/gmodule/grid-configuration/service/grid-configuration.service';
import { GridToolbarItemService } from '../service/grid-toolbar-item.service';
import { IGridToolbarItem } from '../grid-toolbar-item.model';
import { GridToolbarItemFormService } from './grid-toolbar-item-form.service';

import { GridToolbarItemUpdateComponent } from './grid-toolbar-item-update.component';

describe('GridToolbarItem Management Update Component', () => {
  let comp: GridToolbarItemUpdateComponent;
  let fixture: ComponentFixture<GridToolbarItemUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let gridToolbarItemFormService: GridToolbarItemFormService;
  let gridToolbarItemService: GridToolbarItemService;
  let gridConfigurationService: GridConfigurationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [GridToolbarItemUpdateComponent],
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
      .overrideTemplate(GridToolbarItemUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(GridToolbarItemUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    gridToolbarItemFormService = TestBed.inject(GridToolbarItemFormService);
    gridToolbarItemService = TestBed.inject(GridToolbarItemService);
    gridConfigurationService = TestBed.inject(GridConfigurationService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('should call GridConfiguration query and add missing value', () => {
      const gridToolbarItem: IGridToolbarItem = { id: 19333 };
      const gridConfiguration: IGridConfiguration = { id: 18742 };
      gridToolbarItem.gridConfiguration = gridConfiguration;

      const gridConfigurationCollection: IGridConfiguration[] = [{ id: 18742 }];
      jest.spyOn(gridConfigurationService, 'query').mockReturnValue(of(new HttpResponse({ body: gridConfigurationCollection })));
      const additionalGridConfigurations = [gridConfiguration];
      const expectedCollection: IGridConfiguration[] = [...additionalGridConfigurations, ...gridConfigurationCollection];
      jest.spyOn(gridConfigurationService, 'addGridConfigurationToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ gridToolbarItem });
      comp.ngOnInit();

      expect(gridConfigurationService.query).toHaveBeenCalled();
      expect(gridConfigurationService.addGridConfigurationToCollectionIfMissing).toHaveBeenCalledWith(
        gridConfigurationCollection,
        ...additionalGridConfigurations.map(expect.objectContaining),
      );
      expect(comp.gridConfigurationsSharedCollection).toEqual(expectedCollection);
    });

    it('should update editForm', () => {
      const gridToolbarItem: IGridToolbarItem = { id: 19333 };
      const gridConfiguration: IGridConfiguration = { id: 18742 };
      gridToolbarItem.gridConfiguration = gridConfiguration;

      activatedRoute.data = of({ gridToolbarItem });
      comp.ngOnInit();

      expect(comp.gridConfigurationsSharedCollection).toContainEqual(gridConfiguration);
      expect(comp.gridToolbarItem).toEqual(gridToolbarItem);
    });
  });

  describe('save', () => {
    it('should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IGridToolbarItem>>();
      const gridToolbarItem = { id: 4194 };
      jest.spyOn(gridToolbarItemFormService, 'getGridToolbarItem').mockReturnValue(gridToolbarItem);
      jest.spyOn(gridToolbarItemService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ gridToolbarItem });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: gridToolbarItem }));
      saveSubject.complete();

      // THEN
      expect(gridToolbarItemFormService.getGridToolbarItem).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(gridToolbarItemService.update).toHaveBeenCalledWith(expect.objectContaining(gridToolbarItem));
      expect(comp.isSaving).toEqual(false);
    });

    it('should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IGridToolbarItem>>();
      const gridToolbarItem = { id: 4194 };
      jest.spyOn(gridToolbarItemFormService, 'getGridToolbarItem').mockReturnValue({ id: null });
      jest.spyOn(gridToolbarItemService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ gridToolbarItem: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: gridToolbarItem }));
      saveSubject.complete();

      // THEN
      expect(gridToolbarItemFormService.getGridToolbarItem).toHaveBeenCalled();
      expect(gridToolbarItemService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IGridToolbarItem>>();
      const gridToolbarItem = { id: 4194 };
      jest.spyOn(gridToolbarItemService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ gridToolbarItem });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(gridToolbarItemService.update).toHaveBeenCalled();
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
