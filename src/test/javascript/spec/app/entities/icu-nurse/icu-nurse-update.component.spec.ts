import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { of } from 'rxjs';

import { InstantHelpFinderTestModule } from '../../../test.module';
import { ICUNurseUpdateComponent } from 'app/entities/icu-nurse/icu-nurse-update.component';
import { ICUNurseService } from 'app/entities/icu-nurse/icu-nurse.service';
import { ICUNurse } from 'app/shared/model/icu-nurse.model';

describe('Component Tests', () => {
  describe('ICUNurse Management Update Component', () => {
    let comp: ICUNurseUpdateComponent;
    let fixture: ComponentFixture<ICUNurseUpdateComponent>;
    let service: ICUNurseService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [InstantHelpFinderTestModule],
        declarations: [ICUNurseUpdateComponent],
        providers: [FormBuilder]
      })
        .overrideTemplate(ICUNurseUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(ICUNurseUpdateComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(ICUNurseService);
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', fakeAsync(() => {
        // GIVEN
        const entity = new ICUNurse(123);
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
        const entity = new ICUNurse();
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
