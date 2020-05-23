import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ITurningEvent } from 'app/shared/model/turning-event.model';
import { IUserRole } from 'app/shared/model/user-role.model';
import { TurningEventService } from 'app/entities/turning-event/turning-event.service';
import { Observable, Subscription } from 'rxjs';
import { HttpResponse } from '@angular/common/http';
import { JhiEventManager } from 'ng-jhipster';
import { Account } from 'app/core/user/account.model';
import { AccountService } from 'app/core/auth/account.service';
import { UserRoleService } from 'app/entities/user-role/user-role.service';
import { IAssistant } from 'app/shared/model/assistant.model';
import { ITimeSlot, TimeSlot } from 'app/shared/model/time-slot.model';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'jhi-turning-event-detail',
  templateUrl: './turning-event-detail.component.html'
})
export class TurningEventDetailComponent implements OnInit, OnDestroy {
  isSaving = false;
  turningEvent: ITurningEvent | null = null;
  potentialTimeSlots: ITimeSlot[] = [];

  // TODO: This userRole should be global
  userRole?: IUserRole;
  account: Account | null = null;
  authSubscription?: Subscription;
  eventSubscriber?: Subscription;

  pickTimeSlotsForm = this.fb.group({
    potentialTimeSlotsCtrl: this.fb.array([])
  });

  constructor(
    protected activatedRoute: ActivatedRoute,
    protected turningEventService: TurningEventService,
    protected eventManager: JhiEventManager,
    protected accountService: AccountService,
    protected userRoleService: UserRoleService,
    private fb: FormBuilder
  ) {}

  loadTurningEvent(): void {
    if (this.turningEvent != null && this.turningEvent.id != undefined) {
      this.turningEventService.find(this.turningEvent.id).subscribe((res: HttpResponse<ITurningEvent>) => {
        this.turningEvent = res.body || null;
      });
    }
  }

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ turningEvent }) => {
      this.turningEvent = turningEvent;
      this.potentialTimeSlots = turningEvent.potentialTimeSlots
        ? turningEvent.potentialTimeSlots.map((pts: TimeSlot) => {
            pts.start = new Date(pts.start ? pts.start : '');
            pts.end = new Date(pts.end ? pts.end : '');
            return pts;
          })
        : [];

      this.createFormInputs(this.potentialTimeSlots);
    });

    this.registerChangeInTurningEvent();

    // ******************************************
    // TODO: This userRole check should be global
    this.authSubscription = this.accountService.getAuthenticationState().subscribe(account => (this.account = account));
    let login: string = '';
    if (this.account?.login != undefined) {
      login = this.account?.login;
    }
    this.userRoleService.findByUserLogin(login).subscribe((res: HttpResponse<IUserRole>) => {
      this.userRole = res.body || undefined;
    });
    // *******************************************
  }

  // TimeSlot Form

  createFormInputs(potentialTimeSlots: ITimeSlot[]) {
    this.pickTimeSlotsForm = this.fb.group({
      potentialTimeSlotsCtrl: this.createFormArray(potentialTimeSlots)
    });
  }

  createFormArray(potentialTimeSlots: ITimeSlot[]) {
    const arr = potentialTimeSlots.map(timeSlot => {
      return new FormControl(timeSlot.isSelected || false);
    });
    return new FormArray(arr);
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

  getTimeSlotCtrl(i: number): AbstractControl | null {
    if (this.pickTimeSlotsForm !== undefined) {
      return (this.pickTimeSlotsForm.get('potentialTimeSlotsCtrl') as FormArray).at(i);
    } else {
      console.log('this.pickTimSlotsForm is undefined.');
      return null;
    }
  }

  save(): void {
    this.isSaving = true;
    if (this.turningEvent?.id !== undefined) {
      this.turningEvent.potentialTimeSlots = this.potentialTimeSlots;
      this.subscribeToSaveResponse(this.turningEventService.update(this.turningEvent));
    }
  }

  //

  acceptTurningEvent(turningEventId: number | undefined): void {
    if (this.userRole != undefined && this.userRole.id != undefined && turningEventId != undefined) {
      if (this.userRole.dtype === 'Doctor') {
        this.subscribeToAcceptResponse(this.turningEventService.acceptTurningEventDoctor(this.userRole.id, turningEventId));
      } else if (this.userRole.dtype === 'Assistant') {
        this.subscribeToAcceptResponse(this.turningEventService.acceptTurningEventAssistant(this.userRole.id, turningEventId));
      }
    }
  }

  protected subscribeToAcceptResponse(result: Observable<HttpResponse<ITurningEvent>>): void {
    result.subscribe(
      () => this.eventManager.broadcast('TurningEventModification'),
      () => console.log('error')
    );
  }

  isMyTurningEvent(turningEvent: ITurningEvent | undefined): boolean {
    if (this.userRole === undefined || this.userRole.id === undefined || turningEvent === undefined) {
      return false;
    } else if (turningEvent.doctor?.id === this.userRole?.id || turningEvent.icuNurse?.id === this.userRole?.id) {
      return true;
    } else if (turningEvent.assistants?.some((assistant: IAssistant) => assistant.id === this.userRole?.id)) {
      return true;
    } else {
      return false;
    }
  }

  registerChangeInTurningEvent(): void {
    this.eventSubscriber = this.eventManager.subscribe('TurningEventModification', () => {
      this.loadTurningEvent();
    });
  }

  previousState(): void {
    window.history.back();
  }

  ngOnDestroy(): void {
    if (this.eventSubscriber) {
      this.eventManager.destroy(this.eventSubscriber);
    }
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
  }
}
