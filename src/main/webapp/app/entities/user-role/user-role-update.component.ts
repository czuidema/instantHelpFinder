import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { IUserRole, UserRole } from 'app/shared/model/user-role.model';
import { UserRoleService } from './user-role.service';
import { IPushSubscription } from 'app/shared/model/push-subscription.model';
import { PushSubscriptionService } from 'app/entities/push-subscription/push-subscription.service';

@Component({
  selector: 'jhi-user-role-update',
  templateUrl: './user-role-update.component.html'
})
export class UserRoleUpdateComponent implements OnInit {
  isSaving = false;
  pushsubscriptions: IPushSubscription[] = [];

  editForm = this.fb.group({
    id: [],
    availability: [],
    pushSubscription: []
  });

  constructor(
    protected userRoleService: UserRoleService,
    protected pushSubscriptionService: PushSubscriptionService,
    protected activatedRoute: ActivatedRoute,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ userRole }) => {
      this.updateForm(userRole);

      this.pushSubscriptionService
        .query({ filter: 'userrole-is-null' })
        .pipe(
          map((res: HttpResponse<IPushSubscription[]>) => {
            return res.body || [];
          })
        )
        .subscribe((resBody: IPushSubscription[]) => {
          if (!userRole.pushSubscription || !userRole.pushSubscription.id) {
            this.pushsubscriptions = resBody;
          } else {
            this.pushSubscriptionService
              .find(userRole.pushSubscription.id)
              .pipe(
                map((subRes: HttpResponse<IPushSubscription>) => {
                  return subRes.body ? [subRes.body].concat(resBody) : resBody;
                })
              )
              .subscribe((concatRes: IPushSubscription[]) => (this.pushsubscriptions = concatRes));
          }
        });
    });
  }

  updateForm(userRole: IUserRole): void {
    this.editForm.patchValue({
      id: userRole.id,
      availability: userRole.availability,
      pushSubscription: userRole.pushSubscription
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const userRole = this.createFromForm();
    if (userRole.id !== undefined) {
      this.subscribeToSaveResponse(this.userRoleService.update(userRole));
    } else {
      this.subscribeToSaveResponse(this.userRoleService.create(userRole));
    }
  }

  private createFromForm(): IUserRole {
    return {
      ...new UserRole(),
      id: this.editForm.get(['id'])!.value,
      availability: this.editForm.get(['availability'])!.value,
      pushSubscription: this.editForm.get(['pushSubscription'])!.value
    };
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IUserRole>>): void {
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

  trackById(index: number, item: IPushSubscription): any {
    return item.id;
  }
}
