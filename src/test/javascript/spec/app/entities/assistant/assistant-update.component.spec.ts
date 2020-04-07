import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { of } from 'rxjs';

import { InstantHelpFinderTestModule } from '../../../test.module';
import { AssistantUpdateComponent } from 'app/entities/assistant/assistant-update.component';
import { AssistantService } from 'app/entities/assistant/assistant.service';
import { Assistant } from 'app/shared/model/assistant.model';

describe('Component Tests', () => {
  describe('Assistant Management Update Component', () => {
    let comp: AssistantUpdateComponent;
    let fixture: ComponentFixture<AssistantUpdateComponent>;
    let service: AssistantService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [InstantHelpFinderTestModule],
        declarations: [AssistantUpdateComponent],
        providers: [FormBuilder]
      })
        .overrideTemplate(AssistantUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(AssistantUpdateComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(AssistantService);
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', fakeAsync(() => {
        // GIVEN
        const entity = new Assistant(123);
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
        const entity = new Assistant();
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
