import { TestBed } from '@angular/core/testing';

import { sampleWithNewData, sampleWithRequiredData } from '../grid-configuration.test-samples';

import { GridConfigurationFormService } from './grid-configuration-form.service';

describe('GridConfiguration Form Service', () => {
  let service: GridConfigurationFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GridConfigurationFormService);
  });

  describe('Service methods', () => {
    describe('createGridConfigurationFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createGridConfigurationFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            gridName: expect.any(Object),
            pageSize: expect.any(Object),
            pagerAllowedPageSizes: expect.any(Object),
            pagerShowPageSizeSelector: expect.any(Object),
            pagerShowNavigationButtons: expect.any(Object),
            allowSorting: expect.any(Object),
            sortingMode: expect.any(Object),
            allowFiltering: expect.any(Object),
            filterRowVisible: expect.any(Object),
            headerFilterVisible: expect.any(Object),
            allowSearch: expect.any(Object),
            searchPanelVisible: expect.any(Object),
            searchPanelWidth: expect.any(Object),
            searchPanelPlaceholder: expect.any(Object),
            allowColumnChooser: expect.any(Object),
            columnChooserEnabled: expect.any(Object),
            columnHidingEnabled: expect.any(Object),
            allowExport: expect.any(Object),
            exportEnabled: expect.any(Object),
            exportFileName: expect.any(Object),
            allowGrouping: expect.any(Object),
            groupPanelVisible: expect.any(Object),
            allowColumnReordering: expect.any(Object),
            allowColumnResizing: expect.any(Object),
            selectionMode: expect.any(Object),
            selectionAllowSelectAll: expect.any(Object),
            selectionShowCheckBoxesMode: expect.any(Object),
            editingMode: expect.any(Object),
            editingAllowAdding: expect.any(Object),
            editingAllowUpdating: expect.any(Object),
            editingAllowDeleting: expect.any(Object),
            createdDate: expect.any(Object),
          }),
        );
      });

      it('passing IGridConfiguration should create a new form with FormGroup', () => {
        const formGroup = service.createGridConfigurationFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            gridName: expect.any(Object),
            pageSize: expect.any(Object),
            pagerAllowedPageSizes: expect.any(Object),
            pagerShowPageSizeSelector: expect.any(Object),
            pagerShowNavigationButtons: expect.any(Object),
            allowSorting: expect.any(Object),
            sortingMode: expect.any(Object),
            allowFiltering: expect.any(Object),
            filterRowVisible: expect.any(Object),
            headerFilterVisible: expect.any(Object),
            allowSearch: expect.any(Object),
            searchPanelVisible: expect.any(Object),
            searchPanelWidth: expect.any(Object),
            searchPanelPlaceholder: expect.any(Object),
            allowColumnChooser: expect.any(Object),
            columnChooserEnabled: expect.any(Object),
            columnHidingEnabled: expect.any(Object),
            allowExport: expect.any(Object),
            exportEnabled: expect.any(Object),
            exportFileName: expect.any(Object),
            allowGrouping: expect.any(Object),
            groupPanelVisible: expect.any(Object),
            allowColumnReordering: expect.any(Object),
            allowColumnResizing: expect.any(Object),
            selectionMode: expect.any(Object),
            selectionAllowSelectAll: expect.any(Object),
            selectionShowCheckBoxesMode: expect.any(Object),
            editingMode: expect.any(Object),
            editingAllowAdding: expect.any(Object),
            editingAllowUpdating: expect.any(Object),
            editingAllowDeleting: expect.any(Object),
            createdDate: expect.any(Object),
          }),
        );
      });
    });

    describe('getGridConfiguration', () => {
      it('should return NewGridConfiguration for default GridConfiguration initial value', () => {
        const formGroup = service.createGridConfigurationFormGroup(sampleWithNewData);

        const gridConfiguration = service.getGridConfiguration(formGroup) as any;

        expect(gridConfiguration).toMatchObject(sampleWithNewData);
      });

      it('should return NewGridConfiguration for empty GridConfiguration initial value', () => {
        const formGroup = service.createGridConfigurationFormGroup();

        const gridConfiguration = service.getGridConfiguration(formGroup) as any;

        expect(gridConfiguration).toMatchObject({});
      });

      it('should return IGridConfiguration', () => {
        const formGroup = service.createGridConfigurationFormGroup(sampleWithRequiredData);

        const gridConfiguration = service.getGridConfiguration(formGroup) as any;

        expect(gridConfiguration).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IGridConfiguration should not enable id FormControl', () => {
        const formGroup = service.createGridConfigurationFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewGridConfiguration should disable id FormControl', () => {
        const formGroup = service.createGridConfigurationFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
