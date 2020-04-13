import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { InstantHelpFinderTestModule } from '../../../test.module';
import { TurningEventDetailComponent } from 'app/entities/turning-event/turning-event-detail.component';
import { TurningEvent } from 'app/shared/model/turning-event.model';

describe('Component Tests', () => {
  describe('TurningEvent Management Detail Component', () => {
    let comp: TurningEventDetailComponent;
    let fixture: ComponentFixture<TurningEventDetailComponent>;
    const route = ({ data: of({ turningEvent: new TurningEvent(123) }) } as any) as ActivatedRoute;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [InstantHelpFinderTestModule],
        declarations: [TurningEventDetailComponent],
        providers: [{ provide: ActivatedRoute, useValue: route }]
      })
        .overrideTemplate(TurningEventDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(TurningEventDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should load turningEvent on init', () => {
        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.turningEvent).toEqual(jasmine.objectContaining({ id: 123 }));
      });
    });
  });
});
