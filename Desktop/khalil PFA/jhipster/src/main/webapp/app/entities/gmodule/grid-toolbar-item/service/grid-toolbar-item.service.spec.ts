import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';

import { IGridToolbarItem } from '../grid-toolbar-item.model';
import { sampleWithFullData, sampleWithNewData, sampleWithPartialData, sampleWithRequiredData } from '../grid-toolbar-item.test-samples';

import { GridToolbarItemService } from './grid-toolbar-item.service';

const requireRestSample: IGridToolbarItem = {
  ...sampleWithRequiredData,
};

describe('GridToolbarItem Service', () => {
  let service: GridToolbarItemService;
  let httpMock: HttpTestingController;
  let expectedResult: IGridToolbarItem | IGridToolbarItem[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    expectedResult = null;
    service = TestBed.inject(GridToolbarItemService);
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

    it('should create a GridToolbarItem', () => {
      const gridToolbarItem = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(gridToolbarItem).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a GridToolbarItem', () => {
      const gridToolbarItem = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(gridToolbarItem).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a GridToolbarItem', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of GridToolbarItem', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a GridToolbarItem', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addGridToolbarItemToCollectionIfMissing', () => {
      it('should add a GridToolbarItem to an empty array', () => {
        const gridToolbarItem: IGridToolbarItem = sampleWithRequiredData;
        expectedResult = service.addGridToolbarItemToCollectionIfMissing([], gridToolbarItem);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(gridToolbarItem);
      });

      it('should not add a GridToolbarItem to an array that contains it', () => {
        const gridToolbarItem: IGridToolbarItem = sampleWithRequiredData;
        const gridToolbarItemCollection: IGridToolbarItem[] = [
          {
            ...gridToolbarItem,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addGridToolbarItemToCollectionIfMissing(gridToolbarItemCollection, gridToolbarItem);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a GridToolbarItem to an array that doesn't contain it", () => {
        const gridToolbarItem: IGridToolbarItem = sampleWithRequiredData;
        const gridToolbarItemCollection: IGridToolbarItem[] = [sampleWithPartialData];
        expectedResult = service.addGridToolbarItemToCollectionIfMissing(gridToolbarItemCollection, gridToolbarItem);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(gridToolbarItem);
      });

      it('should add only unique GridToolbarItem to an array', () => {
        const gridToolbarItemArray: IGridToolbarItem[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const gridToolbarItemCollection: IGridToolbarItem[] = [sampleWithRequiredData];
        expectedResult = service.addGridToolbarItemToCollectionIfMissing(gridToolbarItemCollection, ...gridToolbarItemArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const gridToolbarItem: IGridToolbarItem = sampleWithRequiredData;
        const gridToolbarItem2: IGridToolbarItem = sampleWithPartialData;
        expectedResult = service.addGridToolbarItemToCollectionIfMissing([], gridToolbarItem, gridToolbarItem2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(gridToolbarItem);
        expect(expectedResult).toContain(gridToolbarItem2);
      });

      it('should accept null and undefined values', () => {
        const gridToolbarItem: IGridToolbarItem = sampleWithRequiredData;
        expectedResult = service.addGridToolbarItemToCollectionIfMissing([], null, gridToolbarItem, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(gridToolbarItem);
      });

      it('should return initial array if no GridToolbarItem is added', () => {
        const gridToolbarItemCollection: IGridToolbarItem[] = [sampleWithRequiredData];
        expectedResult = service.addGridToolbarItemToCollectionIfMissing(gridToolbarItemCollection, undefined, null);
        expect(expectedResult).toEqual(gridToolbarItemCollection);
      });
    });

    describe('compareGridToolbarItem', () => {
      it('should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareGridToolbarItem(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('should return false if one entity is null', () => {
        const entity1 = { id: 4194 };
        const entity2 = null;

        const compareResult1 = service.compareGridToolbarItem(entity1, entity2);
        const compareResult2 = service.compareGridToolbarItem(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('should return false if primaryKey differs', () => {
        const entity1 = { id: 4194 };
        const entity2 = { id: 19333 };

        const compareResult1 = service.compareGridToolbarItem(entity1, entity2);
        const compareResult2 = service.compareGridToolbarItem(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('should return false if primaryKey matches', () => {
        const entity1 = { id: 4194 };
        const entity2 = { id: 4194 };

        const compareResult1 = service.compareGridToolbarItem(entity1, entity2);
        const compareResult2 = service.compareGridToolbarItem(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
