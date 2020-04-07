import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { InstantHelpFinderTestModule } from '../../../test.module';
import { PushSubscriptionDetailComponent } from 'app/entities/push-subscription/push-subscription-detail.component';
import { PushSubscription } from 'app/shared/model/push-subscription.model';

describe('Component Tests', () => {
  describe('PushSubscription Management Detail Component', () => {
    let comp: PushSubscriptionDetailComponent;
    let fixture: ComponentFixture<PushSubscriptionDetailComponent>;
    const route = ({ data: of({ pushSubscription: new PushSubscription(123) }) } as any) as ActivatedRoute;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [InstantHelpFinderTestModule],
        declarations: [PushSubscriptionDetailComponent],
        providers: [{ provide: ActivatedRoute, useValue: route }]
      })
        .overrideTemplate(PushSubscriptionDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(PushSubscriptionDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should load pushSubscription on init', () => {
        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.pushSubscription).toEqual(jasmine.objectContaining({ id: 123 }));
      });
    });
  });
});
