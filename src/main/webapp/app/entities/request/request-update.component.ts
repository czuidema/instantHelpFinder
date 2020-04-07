import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';

import { IRequest, Request } from 'app/shared/model/request.model';
import { RequestService } from './request.service';
import { IDoctor } from 'app/shared/model/doctor.model';
import { DoctorService } from 'app/entities/doctor/doctor.service';
import { IICUNurse } from 'app/shared/model/icu-nurse.model';
import { ICUNurseService } from 'app/entities/icu-nurse/icu-nurse.service';
import { IAssistant } from 'app/shared/model/assistant.model';
import { AssistantService } from 'app/entities/assistant/assistant.service';

type SelectableEntity = IDoctor | IICUNurse | IAssistant;

@Component({
  selector: 'jhi-request-update',
  templateUrl: './request-update.component.html'
})
export class RequestUpdateComponent implements OnInit {
  isSaving = false;
  doctors: IDoctor[] = [];
  icunurses: IICUNurse[] = [];
  assistants: IAssistant[] = [];

  editForm = this.fb.group({
    id: [],
    location: [],
    doctor: [],
    icuNurse: [],
    assistants: []
  });

  constructor(
    protected requestService: RequestService,
    protected doctorService: DoctorService,
    protected iCUNurseService: ICUNurseService,
    protected assistantService: AssistantService,
    protected activatedRoute: ActivatedRoute,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ request }) => {
      this.updateForm(request);

      this.doctorService.query().subscribe((res: HttpResponse<IDoctor[]>) => (this.doctors = res.body || []));

      this.iCUNurseService.query().subscribe((res: HttpResponse<IICUNurse[]>) => (this.icunurses = res.body || []));

      this.assistantService.query().subscribe((res: HttpResponse<IAssistant[]>) => (this.assistants = res.body || []));
    });
  }

  updateForm(request: IRequest): void {
    this.editForm.patchValue({
      id: request.id,
      location: request.location,
      doctor: request.doctor,
      icuNurse: request.icuNurse,
      assistants: request.assistants
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const request = this.createFromForm();
    if (request.id !== undefined) {
      this.subscribeToSaveResponse(this.requestService.update(request));
    } else {
      this.subscribeToSaveResponse(this.requestService.create(request));
    }
  }

  private createFromForm(): IRequest {
    return {
      ...new Request(),
      id: this.editForm.get(['id'])!.value,
      location: this.editForm.get(['location'])!.value,
      doctor: this.editForm.get(['doctor'])!.value,
      icuNurse: this.editForm.get(['icuNurse'])!.value,
      assistants: this.editForm.get(['assistants'])!.value
    };
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IRequest>>): void {
    result.subscribe(
      () => this.onSaveSuccess(),
      () => this.onSaveError()
    );
  }

  protected onSaveSuccess(): void {
    this.isSaving = false;
    this.previousState();
  }

  protected onSaveError(): void {
    this.isSaving = false;
  }

  trackById(index: number, item: SelectableEntity): any {
    return item.id;
  }

  getSelected(selectedVals: IAssistant[], option: IAssistant): IAssistant {
    if (selectedVals) {
      for (let i = 0; i < selectedVals.length; i++) {
        if (option.id === selectedVals[i].id) {
          return selectedVals[i];
        }
      }
    }
    return option;
  }
}
