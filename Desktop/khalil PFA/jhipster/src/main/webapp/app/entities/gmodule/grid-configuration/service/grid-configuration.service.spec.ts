import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';

import { IGridConfiguration } from '../grid-configuration.model';
import { sampleWithFullData, sampleWithNewData, sampleWithPartialData, sampleWithRequiredData } from '../grid-configuration.test-samples';

import { GridConfigurationService, RestGridConfiguration } from './grid-configuration.service';

const requireRestSample: RestGridConfiguration = {
  ...sampleWithRequiredData,
  createdDate: sampleWithRequiredData.createdDate?.toJSON(),
};

describe('GridConfiguration Service', () => {
  let service: GridConfigurationService;
  let httpMock: HttpTestingController;
  let expectedResult: IGridConfiguration | IGridConfiguration[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    expectedResult = null;
    service = TestBed.inject(GridConfigurationService);
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

    it('should create a GridConfiguration', () => {
      const gridConfiguration = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(gridConfiguration).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a GridConfiguration', () => {
      const gridConfiguration = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(gridConfiguration).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a GridConfiguration', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of GridConfiguration', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a GridConfiguration', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addGridConfigurationToCollectionIfMissing', () => {
      it('should add a GridConfiguration to an empty array', () => {
        const gridConfiguration: IGridConfiguration = sampleWithRequiredData;
        expectedResult = service.addGridConfigurationToCollectionIfMissing([], gridConfiguration);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(gridConfiguration);
      });

      it('should not add a GridConfiguration to an array that contains it', () => {
        const gridConfiguration: IGridConfiguration = sampleWithRequiredData;
        const gridConfigurationCollection: IGridConfiguration[] = [
          {
            ...gridConfiguration,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addGridConfigurationToCollectionIfMissing(gridConfigurationCollection, gridConfiguration);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a GridConfiguration to an array that doesn't contain it", () => {
        const gridConfiguration: IGridConfiguration = sampleWithRequiredData;
        const gridConfigurationCollection: IGridConfiguration[] = [sampleWithPartialData];
        expectedResult = service.addGridConfigurationToCollectionIfMissing(gridConfigurationCollection, gridConfiguration);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(gridConfiguration);
      });

      it('should add only unique GridConfiguration to an array', () => {
        const gridConfigurationArray: IGridConfiguration[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const gridConfigurationCollection: IGridConfiguration[] = [sampleWithRequiredData];
        expectedResult = service.addGridConfigurationToCollectionIfMissing(gridConfigurationCollection, ...gridConfigurationArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const gridConfiguration: IGridConfiguration = sampleWithRequiredData;
        const gridConfiguration2: IGridConfiguration = sampleWithPartialData;
        expectedResult = service.addGridConfigurationToCollectionIfMissing([], gridConfiguration, gridConfiguration2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(gridConfiguration);
        expect(expectedResult).toContain(gridConfiguration2);
      });

      it('should accept null and undefined values', () => {
        const gridConfiguration: IGridConfiguration = sampleWithRequiredData;
        expectedResult = service.addGridConfigurationToCollectionIfMissing([], null, gridConfiguration, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(gridConfiguration);
      });

      it('should return initial array if no GridConfiguration is added', () => {
        const gridConfigurationCollection: IGridConfiguration[] = [sampleWithRequiredData];
        expectedResult = service.addGridConfigurationToCollectionIfMissing(gridConfigurationCollection, undefined, null);
        expect(expectedResult).toEqual(gridConfigurationCollection);
      });
    });

    describe('compareGridConfiguration', () => {
      it('should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareGridConfiguration(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('should return false if one entity is null', () => {
        const entity1 = { id: 18742 };
        const entity2 = null;

        const compareResult1 = service.compareGridConfiguration(entity1, entity2);
        const compareResult2 = service.compareGridConfiguration(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('should return false if primaryKey differs', () => {
        const entity1 = { id: 18742 };
        const entity2 = { id: 12340 };

        const compareResult1 = service.compareGridConfiguration(entity1, entity2);
        const compareResult2 = service.compareGridConfiguration(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('should return false if primaryKey matches', () => {
        const entity1 = { id: 18742 };
        const entity2 = { id: 18742 };

        const compareResult1 = service.compareGridConfiguration(entity1, entity2);
        const compareResult2 = service.compareGridConfiguration(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
