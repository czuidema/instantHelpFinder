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

@Component({
  selector: 'jhi-turning-event',
  templateUrl: './turning-event.component.html'
})
export class TurningEventComponent implements OnInit, OnDestroy {
  turningEvents?: ITurningEvent[];
  openTurningEvents?: ITurningEvent[];
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

  loadOpenTurningEvents(dtype: string): void {
    this.turningEventService.queryTasks(dtype).subscribe((res: HttpResponse<ITurningEvent[]>) => (this.openTurningEvents = res.body || []));
  }

  acceptTurningEvent(turningEventId: number): void {
    if (this.userRole != undefined && this.userRole.id != undefined) {
      if (this.userRole.dtype === 'Doctor') {
        this.subscribeToAcceptResponse(this.turningEventService.acceptTurningEventDoctor(this.userRole.id, turningEventId));
      } else if (this.userRole.dtype === 'Assistant') {
        // REST API for assistant
      }
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

    this.authSubscription = this.accountService.getAuthenticationState().subscribe(account => (this.account = account));
    // TODO: needs to be simplified!
    let login: string = '';
    if (this.account?.login != undefined) {
      login = this.account?.login;
    }
    this.userRoleService.findByUserLogin(login).subscribe((res: HttpResponse<IUserRole>) => {
      this.userRole = res.body || undefined;
      if (this.userRole != undefined) {
        if (this.userRole.dtype === 'Doctor') {
          this.loadOpenTurningEvents('Doctor');
        } else if (this.userRole.dtype === 'Assistant') {
          this.loadOpenTurningEvents('Assistant');
        }
      }
    });
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
        this.loadOpenTurningEvents(this.userRole?.dtype);
      }
    });
  }

  delete(turningEvent: ITurningEvent): void {
    const modalRef = this.modalService.open(TurningEventDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.turningEvent = turningEvent;
  }
}
