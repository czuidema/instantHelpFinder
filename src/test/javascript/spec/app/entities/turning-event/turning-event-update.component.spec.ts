import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { of } from 'rxjs';

import { InstantHelpFinderTestModule } from '../../../test.module';
import { TurningEventUpdateComponent } from 'app/entities/turning-event/turning-event-update.component';
import { TurningEventService } from 'app/entities/turning-event/turning-event.service';
import { TurningEvent } from 'app/shared/model/turning-event.model';

describe('Component Tests', () => {
  describe('TurningEvent Management Update Component', () => {
    let comp: TurningEventUpdateComponent;
    let fixture: ComponentFixture<TurningEventUpdateComponent>;
    let service: TurningEventService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [InstantHelpFinderTestModule],
        declarations: [TurningEventUpdateComponent],
        providers: [FormBuilder]
      })
        .overrideTemplate(TurningEventUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(TurningEventUpdateComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(TurningEventService);
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', fakeAsync(() => {
        // GIVEN
        const entity = new TurningEvent(123);
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
        const entity = new TurningEvent();
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
