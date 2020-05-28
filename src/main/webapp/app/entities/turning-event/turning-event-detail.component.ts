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

@Component({
  selector: 'jhi-turning-event-detail',
  templateUrl: './turning-event-detail.component.html'
})
export class TurningEventDetailComponent implements OnInit, OnDestroy {
  turningEvent: ITurningEvent | null = null;

  // TODO: This userRole should be global
  userRole?: IUserRole;
  account: Account | null = null;
  authSubscription?: Subscription;
  eventSubscriber?: Subscription;

  constructor(
    protected activatedRoute: ActivatedRoute,
    protected turningEventService: TurningEventService,
    protected eventManager: JhiEventManager,
    protected accountService: AccountService,
    protected userRoleService: UserRoleService
  ) {}

  loadTurningEvent(): void {
    if (this.turningEvent != null && this.turningEvent.id != undefined) {
      this.turningEventService.find(this.turningEvent.id).subscribe((res: HttpResponse<ITurningEvent>) => {
        this.turningEvent = res.body || null;
      });
    }
  }

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ turningEvent }) => (this.turningEvent = turningEvent));
    this.registerChangeInTurningEvent();
    this.authSubscription = this.accountService.getAuthenticationState().subscribe(account => (this.account = account));
    this.userRole = this.accountService.getUserRole();
  }

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
    } else if (turningEvent.doctor?.id === this.userRole?.id) {
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
