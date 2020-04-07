import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { HttpHeaders, HttpResponse } from '@angular/common/http';

import { InstantHelpFinderTestModule } from '../../../test.module';
import { PushSubscriptionComponent } from 'app/entities/push-subscription/push-subscription.component';
import { PushSubscriptionService } from 'app/entities/push-subscription/push-subscription.service';
import { PushSubscription } from 'app/shared/model/push-subscription.model';

describe('Component Tests', () => {
  describe('PushSubscription Management Component', () => {
    let comp: PushSubscriptionComponent;
    let fixture: ComponentFixture<PushSubscriptionComponent>;
    let service: PushSubscriptionService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [InstantHelpFinderTestModule],
        declarations: [PushSubscriptionComponent]
      })
        .overrideTemplate(PushSubscriptionComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(PushSubscriptionComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(PushSubscriptionService);
    });

    it('Should call load all on init', () => {
      // GIVEN
      const headers = new HttpHeaders().append('link', 'link;link');
      spyOn(service, 'query').and.returnValue(
        of(
          new HttpResponse({
            body: [new PushSubscription(123)],
            headers
          })
        )
      );

      // WHEN
      comp.ngOnInit();

      // THEN
      expect(service.query).toHaveBeenCalled();
      expect(comp.pushSubscriptions && comp.pushSubscriptions[0]).toEqual(jasmine.objectContaining({ id: 123 }));
    });
  });
});
