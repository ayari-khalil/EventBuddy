import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';

import { IGridColumn } from '../grid-column.model';
import { sampleWithFullData, sampleWithNewData, sampleWithPartialData, sampleWithRequiredData } from '../grid-column.test-samples';

import { GridColumnService } from './grid-column.service';

const requireRestSample: IGridColumn = {
  ...sampleWithRequiredData,
};

describe('GridColumn Service', () => {
  let service: GridColumnService;
  let httpMock: HttpTestingController;
  let expectedResult: IGridColumn | IGridColumn[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    expectedResult = null;
    service = TestBed.inject(GridColumnService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.find(123).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should create a GridColumn', () => {
      const gridColumn = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(gridColumn).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a GridColumn', () => {
      const gridColumn = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(gridColumn).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a GridColumn', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of GridColumn', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a GridColumn', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addGridColumnToCollectionIfMissing', () => {
      it('should add a GridColumn to an empty array', () => {
        const gridColumn: IGridColumn = sampleWithRequiredData;
        expectedResult = service.addGridColumnToCollectionIfMissing([], gridColumn);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(gridColumn);
      });

      it('should not add a GridColumn to an array that contains it', () => {
        const gridColumn: IGridColumn = sampleWithRequiredData;
        const gridColumnCollection: IGridColumn[] = [
          {
            ...gridColumn,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addGridColumnToCollectionIfMissing(gridColumnCollection, gridColumn);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a GridColumn to an array that doesn't contain it", () => {
        const gridColumn: IGridColumn = sampleWithRequiredData;
        const gridColumnCollection: IGridColumn[] = [sampleWithPartialData];
        expectedResult = service.addGridColumnToCollectionIfMissing(gridColumnCollection, gridColumn);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(gridColumn);
      });

      it('should add only unique GridColumn to an array', () => {
        const gridColumnArray: IGridColumn[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const gridColumnCollection: IGridColumn[] = [sampleWithRequiredData];
        expectedResult = service.addGridColumnToCollectionIfMissing(gridColumnCollection, ...gridColumnArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const gridColumn: IGridColumn = sampleWithRequiredData;
        const gridColumn2: IGridColumn = sampleWithPartialData;
        expectedResult = service.addGridColumnToCollectionIfMissing([], gridColumn, gridColumn2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(gridColumn);
        expect(expectedResult).toContain(gridColumn2);
      });

      it('should accept null and undefined values', () => {
        const gridColumn: IGridColumn = sampleWithRequiredData;
        expectedResult = service.addGridColumnToCollectionIfMissing([], null, gridColumn, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(gridColumn);
      });

      it('should return initial array if no GridColumn is added', () => {
        const gridColumnCollection: IGridColumn[] = [sampleWithRequiredData];
        expectedResult = service.addGridColumnToCollectionIfMissing(gridColumnCollection, undefined, null);
        expect(expectedResult).toEqual(gridColumnCollection);
      });
    });

    describe('compareGridColumn', () => {
      it('should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareGridColumn(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('should return false if one entity is null', () => {
        const entity1 = { id: 15689 };
        const entity2 = null;

        const compareResult1 = service.compareGridColumn(entity1, entity2);
        const compareResult2 = service.compareGridColumn(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('should return false if primaryKey differs', () => {
        const entity1 = { id: 15689 };
        const entity2 = { id: 26575 };

        const compareResult1 = service.compareGridColumn(entity1, entity2);
        const compareResult2 = service.compareGridColumn(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('should return false if primaryKey matches', () => {
        const entity1 = { id: 15689 };
        const entity2 = { id: 15689 };

        const compareResult1 = service.compareGridColumn(entity1, entity2);
        const compareResult2 = service.compareGridColumn(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
