import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ITurningEvent } from 'app/shared/model/turning-event.model';
import { IUserRole } from 'app/shared/model/user-role.model';
import { TurningEventService } from 'app/entities/turning-event/turning-event.service';
import { combineLatest, Observable, Subject } from 'rxjs';
import { HttpResponse } from '@angular/common/http';
import { JhiEventManager } from 'ng-jhipster';
import { Account } from 'app/core/user/account.model';
import { AccountService } from 'app/core/auth/account.service';
import { UserRoleService } from 'app/entities/user-role/user-role.service';
import { IAssistant } from 'app/shared/model/assistant.model';
import { TimeSlot } from 'app/shared/model/time-slot.model';
import { FormBuilder, FormControl } from '@angular/forms';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'jhi-turning-event-detail',
  templateUrl: './turning-event-detail.component.html'
})
export class TurningEventDetailComponent implements OnInit, OnDestroy {
  isSaving = false;
  turningEvent: ITurningEvent | null = null;

  // TODO: This userRole should be global
  userRole?: IUserRole;
  account: Account | null = null;

  timeSlotsFormArray = this.fb.array([]);

  isMyTurningEvent = false;

  destroy = new Subject<void>();

  constructor(
    protected activatedRoute: ActivatedRoute,
    protected turningEventService: TurningEventService,
    protected eventManager: JhiEventManager,
    protected accountService: AccountService,
    protected userRoleService: UserRoleService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    combineLatest([this.activatedRoute.data, this.accountService.getAuthenticationState().pipe(takeUntil(this.destroy))])
      .pipe(takeUntil(this.destroy))
      .subscribe(([data, account]) => {
        this.turningEvent = data.turningEvent;
        this.turningEvent!.potentialTimeSlots = data.turningEvent.potentialTimeSlots
          ? data.turningEvent.potentialTimeSlots.map((pts: TimeSlot) => {
              pts.start = new Date(pts.start ? pts.start : '');
              pts.end = new Date(pts.end ? pts.end : '');
              return pts;
            })
          : [];
        this.account = account;
        const login = this.account?.login ? this.account.login : '';

        this.userRoleService.findByUserLogin(login).subscribe((res: HttpResponse<IUserRole>) => {
          // TODO: This userRole check should be global
          this.userRole = res.body || undefined;
          if (this.userRole === undefined || this.userRole.id === undefined || this.turningEvent === undefined) {
            this.isMyTurningEvent = false;
          } else if (this.turningEvent?.doctor?.id === this.userRole?.id || this.turningEvent?.icuNurse?.id === this.userRole?.id) {
            this.isMyTurningEvent = true;
          } else if (this.turningEvent?.assistants?.some((assistant: IAssistant) => assistant.id === this.userRole?.id)) {
            this.isMyTurningEvent = true;
          } else {
            this.isMyTurningEvent = false;
          }

          this.initFormArray();
        });
      });
  }

  // TimeSlot Form

  initFormArray(): void {
    this.turningEvent?.potentialTimeSlots!.map(timeSlot => this.timeSlotsFormArray.push(new FormControl(false)));
    if (this.isMyTurningEvent) {
      this.timeSlotsFormArray.disable({ emitEvent: false });
    }
  }

  acceptTurningEvent(): void {
    if (
      this.userRole !== undefined &&
      this.userRole.id !== undefined &&
      this.turningEvent !== undefined &&
      this.turningEvent?.id !== undefined
    ) {
      const timeSlotsSelections = this.timeSlotsFormArray.getRawValue();
      if (this.userRole.dtype === 'Doctor') {
        this.turningEvent.potentialTimeSlots = this.turningEvent.potentialTimeSlots!.filter((timeSlot, i) => {
          return (timeSlot.selected = timeSlotsSelections[i]);
        });
        this.subscribeToAcceptResponse(this.turningEventService.acceptTurningEventDoctor(this.userRole.id, this.turningEvent));
      } else if (this.userRole.dtype === 'Assistant') {
        this.turningEvent.potentialTimeSlots!.forEach((timeSlot, i) => {
          timeSlot.selected = timeSlotsSelections[i];
        });
        this.subscribeToAcceptResponse(this.turningEventService.acceptTurningEventAssistant(this.userRole.id, this.turningEvent));
      }
    }
  }

  protected subscribeToAcceptResponse(result: Observable<HttpResponse<ITurningEvent>>): void {
    result.subscribe(() => this.eventManager.broadcast('TurningEventModification'));
  }

  previousState(): void {
    window.history.back();
  }

  ngOnDestroy(): void {
    this.destroy.next();
    this.destroy.complete();
  }
}
