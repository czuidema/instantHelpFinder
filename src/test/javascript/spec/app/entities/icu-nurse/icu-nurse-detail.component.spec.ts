import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { InstantHelpFinderTestModule } from '../../../test.module';
import { ICUNurseDetailComponent } from 'app/entities/icu-nurse/icu-nurse-detail.component';
import { ICUNurse } from 'app/shared/model/icu-nurse.model';

describe('Component Tests', () => {
  describe('ICUNurse Management Detail Component', () => {
    let comp: ICUNurseDetailComponent;
    let fixture: ComponentFixture<ICUNurseDetailComponent>;
    const route = ({ data: of({ iCUNurse: new ICUNurse(123) }) } as any) as ActivatedRoute;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [InstantHelpFinderTestModule],
        declarations: [ICUNurseDetailComponent],
        providers: [{ provide: ActivatedRoute, useValue: route }]
      })
        .overrideTemplate(ICUNurseDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(ICUNurseDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should load iCUNurse on init', () => {
        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.iCUNurse).toEqual(jasmine.objectContaining({ id: 123 }));
      });
    });
  });
});
