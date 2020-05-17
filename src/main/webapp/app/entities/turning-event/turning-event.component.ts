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

@Component({
  selector: 'jhi-turning-event',
  templateUrl: './turning-event.component.html'
})
export class TurningEventComponent implements OnInit, OnDestroy {
  turningEvents?: ITurningEvent[];
  turningEventsDoctors?: ITurningEvent[];
  eventSubscriber?: Subscription;
  account: Account | null = null;
  authSubscription?: Subscription;
  user?: IUser;
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
    protected userService: UserService
  ) {}

  loadAll(): void {
    this.turningEventService.query().subscribe((res: HttpResponse<ITurningEvent[]>) => (this.turningEvents = res.body || []));
  }

  acceptTurningEventDoctor(turningEventId: number): void {
    if (this.user != undefined) {
      this.subscribeToAcceptResponse(this.turningEventService.acceptTurningEventDoctor(this.user.id, turningEventId));
    }
  }

  protected subscribeToAcceptResponse(result: Observable<HttpResponse<ITurningEvent>>): void {
    result.subscribe(
      () => console.log('success'),
      () => console.log('error')
    );
  }

  ngOnInit(): void {
    this.loadAll();
    this.registerChangeInTurningEvents();

    this.authSubscription = this.accountService.getAuthenticationState().subscribe(account => (this.account = account));
    // TODO: needs to be simplified!
    let userName: string = '';
    if (this.account?.login != undefined) {
      userName = this.account?.login;
    }
    this.userSubscription = this.userService.find(userName).subscribe(user => (this.user = user));
    this.turningEventService
      .queryTasks('Doctors')
      .subscribe((res: HttpResponse<ITurningEvent[]>) => (this.turningEventsDoctors = res.body || []));
  }

  ngOnDestroy(): void {
    if (this.eventSubscriber) {
      this.eventManager.destroy(this.eventSubscriber);
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
  }

  delete(turningEvent: ITurningEvent): void {
    const modalRef = this.modalService.open(TurningEventDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.turningEvent = turningEvent;
  }
}
