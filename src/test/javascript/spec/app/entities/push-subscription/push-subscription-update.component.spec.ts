import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { of } from 'rxjs';

import { InstantHelpFinderTestModule } from '../../../test.module';
import { PushSubscriptionUpdateComponent } from 'app/entities/push-subscription/push-subscription-update.component';
import { PushSubscriptionService } from 'app/entities/push-subscription/push-subscription.service';
import { PushSubscription } from 'app/shared/model/push-subscription.model';

describe('Component Tests', () => {
  describe('PushSubscription Management Update Component', () => {
    let comp: PushSubscriptionUpdateComponent;
    let fixture: ComponentFixture<PushSubscriptionUpdateComponent>;
    let service: PushSubscriptionService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [InstantHelpFinderTestModule],
        declarations: [PushSubscriptionUpdateComponent],
        providers: [FormBuilder]
      })
        .overrideTemplate(PushSubscriptionUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(PushSubscriptionUpdateComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(PushSubscriptionService);
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', fakeAsync(() => {
        // GIVEN
        const entity = new PushSubscription(123);
        spyOn(service, 'update').and.returnValue(of(new HttpResponse({ body: entity })));
        comp.updateForm(entity);
        // WHEN
        comp.save();
        tick(); // simulate async

        // THEN
        expect(service.update).toHaveBeenCalledWith(entity);
        expect(comp.isSaving).toEqual(false);
      }));

      it('Should call create service on save for new entity', fakeAsync(() => {
        // GIVEN
        const entity = new PushSubscription();
        spyOn(service, 'create').and.returnValue(of(new HttpResponse({ body: entity })));
        comp.updateForm(entity);
        // WHEN
        comp.save();
        tick(); // simulate async

        // THEN
        expect(service.create).toHaveBeenCalledWith(entity);
        expect(comp.isSaving).toEqual(false);
      }));
    });
  });
});
