import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';

import { ITurningEvent, TurningEvent } from 'app/shared/model/turning-event.model';
import { TurningEventService } from './turning-event.service';
import { IDoctor } from 'app/shared/model/doctor.model';
import { DoctorService } from 'app/entities/doctor/doctor.service';
import { IICUNurse } from 'app/shared/model/icu-nurse.model';
import { ICUNurseService } from 'app/entities/icu-nurse/icu-nurse.service';
import { IAssistant } from 'app/shared/model/assistant.model';
import { AssistantService } from 'app/entities/assistant/assistant.service';

type SelectableEntity = IDoctor | IICUNurse | IAssistant;

@Component({
  selector: 'jhi-turning-event-update',
  templateUrl: './turning-event-update.component.html'
})
export class TurningEventUpdateComponent implements OnInit {
  isSaving = false;
  doctors: IDoctor[] = [];
  icunurses: IICUNurse[] = [];
  assistants: IAssistant[] = [];

  editForm = this.fb.group({
    id: [],
    patientName: [],
    patientData: [],
    ward: [],
    roomNr: [],
    priority: [],
    doctor: [],
    icuNurse: [],
    assistants: []
  });

  constructor(
    protected turningEventService: TurningEventService,
    protected doctorService: DoctorService,
    protected iCUNurseService: ICUNurseService,
    protected assistantService: AssistantService,
    protected activatedRoute: ActivatedRoute,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ turningEvent }) => {
      this.updateForm(turningEvent);

      this.doctorService.query().subscribe((res: HttpResponse<IDoctor[]>) => (this.doctors = res.body || []));

      this.iCUNurseService.query().subscribe((res: HttpResponse<IICUNurse[]>) => (this.icunurses = res.body || []));

      this.assistantService.query().subscribe((res: HttpResponse<IAssistant[]>) => (this.assistants = res.body || []));
    });
  }

  updateForm(turningEvent: ITurningEvent): void {
    this.editForm.patchValue({
      id: turningEvent.id,
      patientName: turningEvent.patientName,
      patientData: turningEvent.patientData,
      ward: turningEvent.ward,
      roomNr: turningEvent.roomNr,
      priority: turningEvent.priority,
      doctor: turningEvent.doctor,
      icuNurse: turningEvent.icuNurse,
      assistants: turningEvent.assistants
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const turningEvent = this.createFromForm();
    if (turningEvent.id !== undefined) {
      this.subscribeToSaveResponse(this.turningEventService.update(turningEvent));
    } else {
      this.subscribeToSaveResponse(this.turningEventService.create(turningEvent));
    }
  }

  private createFromForm(): ITurningEvent {
    return {
      ...new TurningEvent(),
      id: this.editForm.get(['id'])!.value,
      patientName: this.editForm.get(['patientName'])!.value,
      patientData: this.editForm.get(['patientData'])!.value,
      ward: this.editForm.get(['ward'])!.value,
      roomNr: this.editForm.get(['roomNr'])!.value,
      priority: this.editForm.get(['priority'])!.value,
      doctor: this.editForm.get(['doctor'])!.value,
      icuNurse: this.editForm.get(['icuNurse'])!.value,
      assistants: this.editForm.get(['assistants'])!.value
    };
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ITurningEvent>>): void {
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
