import { TestBed } from '@angular/core/testing';

import { sampleWithNewData, sampleWithRequiredData } from '../grid-toolbar-item.test-samples';

import { GridToolbarItemFormService } from './grid-toolbar-item-form.service';

describe('GridToolbarItem Form Service', () => {
  let service: GridToolbarItemFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GridToolbarItemFormService);
  });

  describe('Service methods', () => {
    describe('createGridToolbarItemFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createGridToolbarItemFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            location: expect.any(Object),
            widget: expect.any(Object),
            icon: expect.any(Object),
            text: expect.any(Object),
            hint: expect.any(Object),
            onClickAction: expect.any(Object),
            visible: expect.any(Object),
            gridConfiguration: expect.any(Object),
          }),
        );
      });

      it('passing IGridToolbarItem should create a new form with FormGroup', () => {
        const formGroup = service.createGridToolbarItemFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            location: expect.any(Object),
            widget: expect.any(Object),
            icon: expect.any(Object),
            text: expect.any(Object),
            hint: expect.any(Object),
            onClickAction: expect.any(Object),
            visible: expect.any(Object),
            gridConfiguration: expect.any(Object),
          }),
        );
      });
    });

    describe('getGridToolbarItem', () => {
      it('should return NewGridToolbarItem for default GridToolbarItem initial value', () => {
        const formGroup = service.createGridToolbarItemFormGroup(sampleWithNewData);

        const gridToolbarItem = service.getGridToolbarItem(formGroup) as any;

        expect(gridToolbarItem).toMatchObject(sampleWithNewData);
      });

      it('should return NewGridToolbarItem for empty GridToolbarItem initial value', () => {
        const formGroup = service.createGridToolbarItemFormGroup();

        const gridToolbarItem = service.getGridToolbarItem(formGroup) as any;

        expect(gridToolbarItem).toMatchObject({});
      });

      it('should return IGridToolbarItem', () => {
        const formGroup = service.createGridToolbarItemFormGroup(sampleWithRequiredData);

        const gridToolbarItem = service.getGridToolbarItem(formGroup) as any;

        expect(gridToolbarItem).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IGridToolbarItem should not enable id FormControl', () => {
        const formGroup = service.createGridToolbarItemFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewGridToolbarItem should disable id FormControl', () => {
        const formGroup = service.createGridToolbarItemFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
