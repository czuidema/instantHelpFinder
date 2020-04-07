import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { JhiEventManager } from 'ng-jhipster';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IPushSubscription } from 'app/shared/model/push-subscription.model';
import { PushSubscriptionService } from './push-subscription.service';
import { PushSubscriptionDeleteDialogComponent } from './push-subscription-delete-dialog.component';

@Component({
  selector: 'jhi-push-subscription',
  templateUrl: './push-subscription.component.html'
})
export class PushSubscriptionComponent implements OnInit, OnDestroy {
  pushSubscriptions?: IPushSubscription[];
  eventSubscriber?: Subscription;

  constructor(
    protected pushSubscriptionService: PushSubscriptionService,
    protected eventManager: JhiEventManager,
    protected modalService: NgbModal
  ) {}

  loadAll(): void {
    this.pushSubscriptionService.query().subscribe((res: HttpResponse<IPushSubscription[]>) => (this.pushSubscriptions = res.body || []));
  }

  ngOnInit(): void {
    this.loadAll();
    this.registerChangeInPushSubscriptions();
  }

  ngOnDestroy(): void {
    if (this.eventSubscriber) {
      this.eventManager.destroy(this.eventSubscriber);
    }
  }

  trackId(index: number, item: IPushSubscription): number {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
    return item.id!;
  }

  registerChangeInPushSubscriptions(): void {
    this.eventSubscriber = this.eventManager.subscribe('pushSubscriptionListModification', () => this.loadAll());
  }

  delete(pushSubscription: IPushSubscription): void {
    const modalRef = this.modalService.open(PushSubscriptionDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.pushSubscription = pushSubscription;
  }
}
