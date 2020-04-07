import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';

import { IPushSubscription, PushSubscription } from 'app/shared/model/push-subscription.model';
import { PushSubscriptionService } from './push-subscription.service';

@Component({
  selector: 'jhi-push-subscription-update',
  templateUrl: './push-subscription-update.component.html'
})
export class PushSubscriptionUpdateComponent implements OnInit {
  isSaving = false;

  editForm = this.fb.group({
    id: [],
    endpoint: [],
    auth: [],
    p256dh: []
  });

  constructor(
    protected pushSubscriptionService: PushSubscriptionService,
    protected activatedRoute: ActivatedRoute,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ pushSubscription }) => {
      this.updateForm(pushSubscription);
    });
  }

  updateForm(pushSubscription: IPushSubscription): void {
    this.editForm.patchValue({
      id: pushSubscription.id,
      endpoint: pushSubscription.endpoint,
      auth: pushSubscription.auth,
      p256dh: pushSubscription.p256dh
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const pushSubscription = this.createFromForm();
    if (pushSubscription.id !== undefined) {
      this.subscribeToSaveResponse(this.pushSubscriptionService.update(pushSubscription));
    } else {
      this.subscribeToSaveResponse(this.pushSubscriptionService.create(pushSubscription));
    }
  }

  private createFromForm(): IPushSubscription {
    return {
      ...new PushSubscription(),
      id: this.editForm.get(['id'])!.value,
      endpoint: this.editForm.get(['endpoint'])!.value,
      auth: this.editForm.get(['auth'])!.value,
      p256dh: this.editForm.get(['p256dh'])!.value
    };
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IPushSubscription>>): void {
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
}
