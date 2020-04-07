import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IPushSubscription } from 'app/shared/model/push-subscription.model';

@Component({
  selector: 'jhi-push-subscription-detail',
  templateUrl: './push-subscription-detail.component.html'
})
export class PushSubscriptionDetailComponent implements OnInit {
  pushSubscription: IPushSubscription | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ pushSubscription }) => (this.pushSubscription = pushSubscription));
  }

  previousState(): void {
    window.history.back();
  }
}
