import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Observable, Subscription } from 'rxjs';
import { JhiEventManager } from 'ng-jhipster';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { faInbox } from '@fortawesome/free-solid-svg-icons';

import { ITurningEvent } from 'app/shared/model/turning-event.model';
import { TurningEventService } from './turning-event.service';
import { TurningEventDeleteDialogComponent } from './turning-event-delete-dialog.component';
import { Account } from 'app/core/user/account.model';
import { AccountService } from 'app/core/auth/account.service';
import { IUser } from 'app/core/user/user.model';
import { UserService } from 'app/core/user/user.service';
import { combineAll } from 'rxjs/operators';
import { UserRoleService } from 'app/entities/user-role/user-role.service';
import { IUserRole } from 'app/shared/model/user-role.model';
import { IAssistant } from 'app/shared/model/assistant.model';

@Component({
  selector: 'jhi-turning-event',
  templateUrl: './turning-event.component.html'
})
export class TurningEventComponent implements OnInit, OnDestroy {
  turningEvents?: ITurningEvent[];
  turningEventsInbox?: ITurningEvent[];
  turningEventsSchedule?: ITurningEvent[];
  turningEventsPending?: ITurningEvent[];

  inboxEventSubscriber?: Subscription;
  eventSubscriber?: Subscription;
  account: Account | null = null;
  authSubscription?: Subscription;
  userRole?: IUserRole;
  userSubscription?: Subscription;

  tabToggle: boolean = true;
  accordionInboxToggle: boolean = false;
  isOpen: boolean = true;

  InboxIcon = faInbox;

  constructor(
    protected turningEventService: TurningEventService,
    protected eventManager: JhiEventManager,
    protected modalService: NgbModal,
    protected accountService: AccountService,
    protected userRoleService: UserRoleService
  ) {}

  loadAll(): void {
    this.turningEventService.query().subscribe((res: HttpResponse<ITurningEvent[]>) => (this.turningEvents = res.body || []));
  }

  loadTurningEventsInbox(dtype: string): void {
    if (dtype === 'Assistant') {
      let turningEventsInboxCache$: ITurningEvent[] = [];
      this.turningEventService.queryTasks(dtype).subscribe((res: HttpResponse<ITurningEvent[]>) => {
        turningEventsInboxCache$ = res.body || [];
        this.turningEventsInbox = turningEventsInboxCache$.filter(
          (turningEvent: ITurningEvent) => !turningEvent.assistants?.some((assistant: IAssistant) => assistant.id === this.userRole?.id)
        );
      });
    } else {
      this.turningEventService
        .queryTasks(dtype)
        .subscribe((res: HttpResponse<ITurningEvent[]>) => (this.turningEventsInbox = res.body || []));
    }
  }

  loadTurningEventsSchedule(): void {
    let turningEventsScheduleCache$: ITurningEvent[] = [];
    this.turningEventService.queryTasks('Participant').subscribe((res: HttpResponse<ITurningEvent[]>) => {
      turningEventsScheduleCache$ = this.setDefiniteTimeSlots(res.body || []);
      if (this.userRole === undefined || this.userRole.id === undefined) {
        console.log('userRole or userRole.id is undefined.');
      } else if (this.userRole?.dtype === 'ICUNurse') {
        this.turningEventsSchedule = turningEventsScheduleCache$.filter(
          (turningEvent: ITurningEvent) => turningEvent.icuNurse?.id === this.userRole?.id
        );
      } else if (this.userRole?.dtype === 'Doctor') {
        this.turningEventsSchedule = turningEventsScheduleCache$.filter(
          (turningEvent: ITurningEvent) => turningEvent.doctor?.id === this.userRole?.id
        );
      } else if (this.userRole?.dtype === 'Assistant') {
        this.turningEventsSchedule = turningEventsScheduleCache$.filter((turningEvent: ITurningEvent) =>
          turningEvent.assistants?.some((assistant: IAssistant) => assistant.id === this.userRole?.id)
        );
      }
    });
  }

  loadTurningEventsPending(): void {
    if (this.userRole === undefined || this.userRole.id === undefined) {
      console.log('userRole or userRole.id is undefined.');
    } else if (this.userRole?.dtype === 'ICUNurse') {
      let turningEventsDoctorCache$: ITurningEvent[] = [];
      let turningEventsAssistantCache$: ITurningEvent[] = [];
      this.turningEventService.queryTasks('Doctor').subscribe((res: HttpResponse<ITurningEvent[]>) => {
        turningEventsDoctorCache$ = res.body || [];
        this.turningEventService.queryTasks('Assistant').subscribe((res: HttpResponse<ITurningEvent[]>) => {
          turningEventsAssistantCache$ = res.body || [];
          turningEventsDoctorCache$ = turningEventsDoctorCache$.filter(
            (turningEvent: ITurningEvent) => turningEvent.icuNurse?.id === this.userRole?.id
          );
          turningEventsAssistantCache$ = turningEventsAssistantCache$.filter(
            (turningEvent: ITurningEvent) => turningEvent.icuNurse?.id === this.userRole?.id
          );
          this.turningEventsPending = [...turningEventsDoctorCache$, ...turningEventsAssistantCache$];
        });
      });
    } else if (this.userRole?.dtype === 'Doctor') {
      let turningEventsAssistantCache$: ITurningEvent[] = [];
      this.turningEventService.queryTasks('Assistant').subscribe((res: HttpResponse<ITurningEvent[]>) => {
        turningEventsAssistantCache$ = res.body || [];
        this.turningEventsPending = turningEventsAssistantCache$.filter(
          (turningEvent: ITurningEvent) => turningEvent.doctor?.id === this.userRole?.id
        );
      });
    } else if (this.userRole?.dtype === 'Assistant') {
      let turningEventsAssistantCache$: ITurningEvent[] = [];
      this.turningEventService.queryTasks('Assistant').subscribe((res: HttpResponse<ITurningEvent[]>) => {
        turningEventsAssistantCache$ = res.body || [];
        this.turningEventsPending = turningEventsAssistantCache$.filter((turningEvent: ITurningEvent) =>
          turningEvent.assistants?.some((assistant: IAssistant) => assistant.id === this.userRole?.id)
        );
      });
    }
  }

  setDefiniteTimeSlots(turningEvents: ITurningEvent[]): ITurningEvent[] {
    return turningEvents.map(turningEvent => {
      if (turningEvent.definiteTimeSlot !== undefined) {
        turningEvent.definiteTimeSlot.start = new Date(turningEvent.definiteTimeSlot.start ? turningEvent.definiteTimeSlot.start : '');
        turningEvent.definiteTimeSlot.end = new Date(turningEvent.definiteTimeSlot.end ? turningEvent.definiteTimeSlot.end : '');
      }
      return turningEvent;
    });
  }

  acceptTurningEvent(turningEvent: ITurningEvent): void {
    if (this.userRole != undefined && this.userRole.id != undefined && turningEvent.id !== undefined) {
      if (this.userRole.dtype === 'Doctor') {
        this.subscribeToAcceptResponse(this.turningEventService.acceptTurningEventDoctor(this.userRole.id, turningEvent));
      } else if (this.userRole.dtype === 'Assistant') {
        this.subscribeToAcceptResponse(this.turningEventService.acceptTurningEventAssistant(this.userRole.id, turningEvent));
      }
    }
  }

  isMyTurningEvent(turningEvent: ITurningEvent): boolean {
    if (this.userRole === undefined || this.userRole.id === undefined) {
      return false;
    } else if (turningEvent.doctor?.id === this.userRole?.id) {
      return true;
    } else if (turningEvent.assistants?.some((assistant: IAssistant) => assistant.id === this.userRole?.id)) {
      return true;
    } else {
      return false;
    }
  }

  protected subscribeToAcceptResponse(result: Observable<HttpResponse<ITurningEvent>>): void {
    result.subscribe(
      () => this.eventManager.broadcast('openTurningEventListModification'),
      () => console.log('error')
    );
  }

  ngOnInit(): void {
    // this.loadAll();
    this.registerChangeInTurningEvents();

    // ******************************************
    // TODO: This userRole check should be global
    this.authSubscription = this.accountService.getAuthenticationState().subscribe(account => (this.account = account));
    let login: string = '';
    if (this.account?.login != undefined) {
      login = this.account?.login;
    }
    this.userRoleService.findByUserLogin(login).subscribe((res: HttpResponse<IUserRole>) => {
      this.userRole = res.body || undefined;
      if (this.userRole != undefined) {
        this.loadTurningEventsSchedule();
        this.loadTurningEventsPending();
        if (this.userRole.dtype === 'Doctor') {
          this.loadTurningEventsInbox('Doctor');
        } else if (this.userRole.dtype === 'Assistant') {
          this.loadTurningEventsInbox('Assistant');
        }
      }
    });
    // *******************************************
  }

  ngOnDestroy(): void {
    if (this.eventSubscriber) {
      this.eventManager.destroy(this.eventSubscriber);
    }
    if (this.inboxEventSubscriber) {
      this.eventManager.destroy(this.inboxEventSubscriber);
    }
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
  }

  // Toggle for the tabs
  tabToggleTrue(): void {
    this.tabToggle = true;
  }
  tabToggleFalse(): void {
    this.tabToggle = false;
  }

  toggleAccordion($event: any): void {
    $event.target.classList.toggle('show');
  }

  trackId(index: number, item: ITurningEvent): number {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
    return item.id!;
  }

  registerChangeInTurningEvents(): void {
    this.eventSubscriber = this.eventManager.subscribe('turningEventListModification', () => this.loadAll());
    this.inboxEventSubscriber = this.eventManager.subscribe('openTurningEventListModification', () => {
      if (this.userRole !== undefined && this.userRole.dtype !== undefined) {
        this.loadTurningEventsInbox(this.userRole?.dtype);
        this.loadTurningEventsPending();
        this.loadTurningEventsSchedule();
      }
    });
  }

  delete(turningEvent: ITurningEvent): void {
    const modalRef = this.modalService.open(TurningEventDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.turningEvent = turningEvent;
  }
}
