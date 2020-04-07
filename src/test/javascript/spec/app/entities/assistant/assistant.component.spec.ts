import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { HttpHeaders, HttpResponse } from '@angular/common/http';

import { InstantHelpFinderTestModule } from '../../../test.module';
import { AssistantComponent } from 'app/entities/assistant/assistant.component';
import { AssistantService } from 'app/entities/assistant/assistant.service';
import { Assistant } from 'app/shared/model/assistant.model';

describe('Component Tests', () => {
  describe('Assistant Management Component', () => {
    let comp: AssistantComponent;
    let fixture: ComponentFixture<AssistantComponent>;
    let service: AssistantService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [InstantHelpFinderTestModule],
        declarations: [AssistantComponent]
      })
        .overrideTemplate(AssistantComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(AssistantComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(AssistantService);
    });

    it('Should call load all on init', () => {
      // GIVEN
      const headers = new HttpHeaders().append('link', 'link;link');
      spyOn(service, 'query').and.returnValue(
        of(
          new HttpResponse({
            body: [new Assistant(123)],
            headers
          })
        )
      );

      // WHEN
      comp.ngOnInit();

      // THEN
      expect(service.query).toHaveBeenCalled();
      expect(comp.assistants && comp.assistants[0]).toEqual(jasmine.objectContaining({ id: 123 }));
    });
  });
});
