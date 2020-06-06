import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { AbstractControl, FormArray, FormBuilder, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';

import { ITurningEvent, TurningEvent } from 'app/shared/model/turning-event.model';
import { TurningEventService } from './turning-event.service';
import { Doctor, IDoctor } from 'app/shared/model/doctor.model';
import { DoctorService } from 'app/entities/doctor/doctor.service';
import { IICUNurse } from 'app/shared/model/icu-nurse.model';
import { ICUNurseService } from 'app/entities/icu-nurse/icu-nurse.service';
import { IAssistant } from 'app/shared/model/assistant.model';
import { AssistantService } from 'app/entities/assistant/assistant.service';
import * as moment from 'moment';
import { ITimeSlot, TimeSlot } from 'app/shared/model/time-slot.model';
import { AccountService } from 'app/core/auth/account.service';
import { IUserRole, UserRole } from 'app/shared/model/user-role.model';
import { UserRoleService } from 'app/entities/user-role/user-role.service';

type SelectableEntity = IDoctor | IICUNurse | IAssistant;

@Component({
  selector: 'jhi-turning-event-update',
  templateUrl: './turning-event-update.component.html'
})
export class TurningEventUpdateComponent implements OnInit {
  isSaving = false;
  doctors: IDoctor[] = [];
  icuNurses: IICUNurse[] = [];
  assistants: IAssistant[] = [];
  timeConditions: boolean[] = [false, false, false, false, false, false];

  preferredTime = moment();
  timeStamp = moment().toDate();
  potentialTimeSlots: ITimeSlot[] = [];

  login: String = '';
  currentUserRole: IUserRole = new UserRole();

  isDoctor = false;

  editForm = this.fb.group({
    id: [],
    patientName: ['', [Validators.required]],
    patientData: [],
    ward: ['', [Validators.required]],
    roomNr: ['', [Validators.required]],
    priority: ['', [Validators.required]],
    doctor: [],
    icuNurse: [],
    assistants: [],
    preferredTimeCtrl: [this.preferredTime, [Validators.required]],
    potentialTimeSlotsCtrl: this.fb.array([])
  });

  constructor(
    protected turningEventService: TurningEventService,
    protected doctorService: DoctorService,
    protected iCUNurseService: ICUNurseService,
    protected assistantService: AssistantService,
    protected activatedRoute: ActivatedRoute,
    private fb: FormBuilder,
    private accountService: AccountService,
    private userRoleService: UserRoleService
  ) {}

  ngOnInit(): void {
    this.accountService.identity().subscribe(account => {
      this.currentUserRole = this.accountService.getUserRole();
      if (this.currentUserRole instanceof Doctor) {
        this.isDoctor = true;
      }
    });
    this.activatedRoute.data.subscribe(({ turningEvent }) => {
      this.updateForm(turningEvent);
      this.potentialTimeSlots = turningEvent.potentialTimeSlots
        ? turningEvent.potentialTimeSlots.map((pts: TimeSlot) => {
            pts.start = new Date(pts.start ? pts.start : '');
            pts.end = new Date(pts.end ? pts.end : '');
            return pts;
          })
        : [];

      this.doctorService.query().subscribe((res: HttpResponse<IDoctor[]>) => (this.doctors = res.body || []));

      this.iCUNurseService.query().subscribe((res: HttpResponse<IICUNurse[]>) => (this.icuNurses = res.body || []));

      this.assistantService.query().subscribe((res: HttpResponse<IAssistant[]>) => (this.assistants = res.body || []));
    });

    for (let i = 0; i < 5; i++) {
      this.potentialTimeSlots.push(new TimeSlot(this.preferredTime.toDate(), this.preferredTime.add(10, 'minute').toDate(), false));
      (this.editForm.get('potentialTimeSlotsCtrl') as FormArray).push(
        new FormControl({ value: false, disabled: !this.editForm.get('id')!.value })
      );
    }

    this.editForm.get('preferredTimeCtrl')!.valueChanges.subscribe(value => {
      const time = value.split(':');
      const preferredTime = moment()
        .hour(+time[0])
        .minute(+time[1])
        .second(0);
      for (let i = 0; i < 5; i++) {
        this.potentialTimeSlots[i] = new TimeSlot(preferredTime.toDate(), preferredTime.add(10, 'minute').toDate(), false);
        //(this.editForm.get('potentialTimeSlotsCtrl') as FormArray).push(
        //  new FormControl({ value: false, disabled: !this.editForm.get('id')!.value })
        //);
      }
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
    turningEvent.potentialTimeSlots
      ? turningEvent.potentialTimeSlots.map(pts => {
          (this.editForm.get('potentialTimeSlotsCtrl')! as FormArray).push(new FormControl(pts.selected));
        })
      : [];
  }

  previousState(): void {
    window.history.back();
  }

  ChooseTime1(): void {
    this.timeConditions = [false, false, false, false, false, false];
    this.timeConditions[0] = true;
  }
  ChooseTime2(): void {
    this.timeConditions = [false, false, false, false, false, false];
    this.timeConditions[1] = true;
  }
  ChooseTime3(): void {
    this.timeConditions = [false, false, false, false, false, false];
    this.timeConditions[2] = true;
  }
  ChooseTime4(): void {
    this.timeConditions = [false, false, false, false, false, false];
    this.timeConditions[3] = true;
  }
  ChooseTime5(): void {
    this.timeConditions = [false, false, false, false, false, false];
    this.timeConditions[4] = true;
  }
  ChooseTime6(): void {
    this.timeConditions = [false, false, false, false, false, false];
    this.timeConditions[5] = true;
  }

  save(): void {
    this.isSaving = true;
    const turningEvent = this.createFromForm();
    turningEvent.potentialTimeSlots = this.potentialTimeSlots;
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

  getTimeSlotCtrl(i: number): AbstractControl {
    return (this.editForm.get('potentialTimeSlotsCtrl') as FormArray).at(i);
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

  compareFn(obj1: IUserRole, obj2: IUserRole): boolean {
    if (obj1 != null && obj2 != null) {
      return obj1.id === obj2.id;
    }
    return false;
  }
}
