import { TestBed, getTestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TurningEventService } from 'app/entities/turning-event/turning-event.service';
import { ITurningEvent, TurningEvent } from 'app/shared/model/turning-event.model';
import { EPriority } from 'app/shared/model/enumerations/e-priority.model';

describe('Service Tests', () => {
  describe('TurningEvent Service', () => {
    let injector: TestBed;
    let service: TurningEventService;
    let httpMock: HttpTestingController;
    let elemDefault: ITurningEvent;
    let expectedResult: ITurningEvent | ITurningEvent[] | boolean | null;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule]
      });
      expectedResult = null;
      injector = getTestBed();
      service = injector.get(TurningEventService);
      httpMock = injector.get(HttpTestingController);

      elemDefault = new TurningEvent(0, 'AAAAAAA', 'AAAAAAA', 'AAAAAAA', 'AAAAAAA', EPriority.LOW);
    });

    describe('Service methods', () => {
      it('should find an element', () => {
        const returnedFromService = Object.assign({}, elemDefault);

        service.find(123).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(elemDefault);
      });

      it('should create a TurningEvent', () => {
        const returnedFromService = Object.assign(
          {
            id: 0
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.create(new TurningEvent()).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'POST' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should update a TurningEvent', () => {
        const returnedFromService = Object.assign(
          {
            patientName: 'BBBBBB',
            patientData: 'BBBBBB',
            ward: 'BBBBBB',
            roomNr: 'BBBBBB',
            priority: 'BBBBBB'
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.update(expected).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PUT' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should return a list of TurningEvent', () => {
        const returnedFromService = Object.assign(
          {
            patientName: 'BBBBBB',
            patientData: 'BBBBBB',
            ward: 'BBBBBB',
            roomNr: 'BBBBBB',
            priority: 'BBBBBB'
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.query().subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush([returnedFromService]);
        httpMock.verify();
        expect(expectedResult).toContainEqual(expected);
      });

      it('should delete a TurningEvent', () => {
        service.delete(123).subscribe(resp => (expectedResult = resp.ok));

        const req = httpMock.expectOne({ method: 'DELETE' });
        req.flush({ status: 200 });
        expect(expectedResult);
      });
    });

    afterEach(() => {
      httpMock.verify();
    });
  });
});
