import { TestBed } from '@angular/core/testing';

import { sampleWithNewData, sampleWithRequiredData } from '../grid-column.test-samples';

import { GridColumnFormService } from './grid-column-form.service';

describe('GridColumn Form Service', () => {
  let service: GridColumnFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GridColumnFormService);
  });

  describe('Service methods', () => {
    describe('createGridColumnFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createGridColumnFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            dataField: expect.any(Object),
            caption: expect.any(Object),
            visible: expect.any(Object),
            dataType: expect.any(Object),
            format: expect.any(Object),
            width: expect.any(Object),
            allowSorting: expect.any(Object),
            allowFiltering: expect.any(Object),
            gridConfiguration: expect.any(Object),
          }),
        );
      });

      it('passing IGridColumn should create a new form with FormGroup', () => {
        const formGroup = service.createGridColumnFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            dataField: expect.any(Object),
            caption: expect.any(Object),
            visible: expect.any(Object),
            dataType: expect.any(Object),
            format: expect.any(Object),
            width: expect.any(Object),
            allowSorting: expect.any(Object),
            allowFiltering: expect.any(Object),
            gridConfiguration: expect.any(Object),
          }),
        );
      });
    });

    describe('getGridColumn', () => {
      it('should return NewGridColumn for default GridColumn initial value', () => {
        const formGroup = service.createGridColumnFormGroup(sampleWithNewData);

        const gridColumn = service.getGridColumn(formGroup) as any;

        expect(gridColumn).toMatchObject(sampleWithNewData);
      });

      it('should return NewGridColumn for empty GridColumn initial value', () => {
        const formGroup = service.createGridColumnFormGroup();

        const gridColumn = service.getGridColumn(formGroup) as any;

        expect(gridColumn).toMatchObject({});
      });

      it('should return IGridColumn', () => {
        const formGroup = service.createGridColumnFormGroup(sampleWithRequiredData);

        const gridColumn = service.getGridColumn(formGroup) as any;

        expect(gridColumn).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IGridColumn should not enable id FormControl', () => {
        const formGroup = service.createGridColumnFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewGridColumn should disable id FormControl', () => {
        const formGroup = service.createGridColumnFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
