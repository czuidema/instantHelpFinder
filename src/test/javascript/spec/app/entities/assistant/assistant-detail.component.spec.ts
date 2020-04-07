import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { InstantHelpFinderTestModule } from '../../../test.module';
import { AssistantDetailComponent } from 'app/entities/assistant/assistant-detail.component';
import { Assistant } from 'app/shared/model/assistant.model';

describe('Component Tests', () => {
  describe('Assistant Management Detail Component', () => {
    let comp: AssistantDetailComponent;
    let fixture: ComponentFixture<AssistantDetailComponent>;
    const route = ({ data: of({ assistant: new Assistant(123) }) } as any) as ActivatedRoute;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [InstantHelpFinderTestModule],
        declarations: [AssistantDetailComponent],
        providers: [{ provide: ActivatedRoute, useValue: route }]
      })
        .overrideTemplate(AssistantDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(AssistantDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should load assistant on init', () => {
        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.assistant).toEqual(jasmine.objectContaining({ id: 123 }));
      });
    });
  });
});
