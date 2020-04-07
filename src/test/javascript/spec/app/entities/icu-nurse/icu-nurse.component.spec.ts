import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { HttpHeaders, HttpResponse } from '@angular/common/http';

import { InstantHelpFinderTestModule } from '../../../test.module';
import { ICUNurseComponent } from 'app/entities/icu-nurse/icu-nurse.component';
import { ICUNurseService } from 'app/entities/icu-nurse/icu-nurse.service';
import { ICUNurse } from 'app/shared/model/icu-nurse.model';

describe('Component Tests', () => {
  describe('ICUNurse Management Component', () => {
    let comp: ICUNurseComponent;
    let fixture: ComponentFixture<ICUNurseComponent>;
    let service: ICUNurseService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [InstantHelpFinderTestModule],
        declarations: [ICUNurseComponent]
      })
        .overrideTemplate(ICUNurseComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(ICUNurseComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(ICUNurseService);
    });

    it('Should call load all on init', () => {
      // GIVEN
      const headers = new HttpHeaders().append('link', 'link;link');
      spyOn(service, 'query').and.returnValue(
        of(
          new HttpResponse({
            body: [new ICUNurse(123)],
            headers
          })
        )
      );

      // WHEN
      comp.ngOnInit();

      // THEN
      expect(service.query).toHaveBeenCalled();
      expect(comp.iCUNurses && comp.iCUNurses[0]).toEqual(jasmine.objectContaining({ id: 123 }));
    });
  });
});
