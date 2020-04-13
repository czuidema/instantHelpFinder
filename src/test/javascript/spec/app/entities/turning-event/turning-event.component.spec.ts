import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { HttpHeaders, HttpResponse } from '@angular/common/http';

import { InstantHelpFinderTestModule } from '../../../test.module';
import { TurningEventComponent } from 'app/entities/turning-event/turning-event.component';
import { TurningEventService } from 'app/entities/turning-event/turning-event.service';
import { TurningEvent } from 'app/shared/model/turning-event.model';

describe('Component Tests', () => {
  describe('TurningEvent Management Component', () => {
    let comp: TurningEventComponent;
    let fixture: ComponentFixture<TurningEventComponent>;
    let service: TurningEventService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [InstantHelpFinderTestModule],
        declarations: [TurningEventComponent]
      })
        .overrideTemplate(TurningEventComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(TurningEventComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(TurningEventService);
    });

    it('Should call load all on init', () => {
      // GIVEN
      const headers = new HttpHeaders().append('link', 'link;link');
      spyOn(service, 'query').and.returnValue(
        of(
          new HttpResponse({
            body: [new TurningEvent(123)],
            headers
          })
        )
      );

      // WHEN
      comp.ngOnInit();

      // THEN
      expect(service.query).toHaveBeenCalled();
      expect(comp.turningEvents && comp.turningEvents[0]).toEqual(jasmine.objectContaining({ id: 123 }));
    });
  });
});
