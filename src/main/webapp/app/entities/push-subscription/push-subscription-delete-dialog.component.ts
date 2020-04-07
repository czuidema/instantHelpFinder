import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { IPushSubscription } from 'app/shared/model/push-subscription.model';
import { PushSubscriptionService } from './push-subscription.service';

@Component({
  templateUrl: './push-subscription-delete-dialog.component.html'
})
export class PushSubscriptionDeleteDialogComponent {
  pushSubscription?: IPushSubscription;

  constructor(
    protected pushSubscriptionService: PushSubscriptionService,
    public activeModal: NgbActiveModal,
    protected eventManager: JhiEventManager
  ) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.pushSubscriptionService.delete(id).subscribe(() => {
      this.eventManager.broadcast('pushSubscriptionListModification');
      this.activeModal.close();
    });
  }
}
