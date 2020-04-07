import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Routes, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { flatMap } from 'rxjs/operators';

import { Authority } from 'app/shared/constants/authority.constants';
import { UserRouteAccessService } from 'app/core/auth/user-route-access-service';
import { IPushSubscription, PushSubscription } from 'app/shared/model/push-subscription.model';
import { PushSubscriptionService } from './push-subscription.service';
import { PushSubscriptionComponent } from './push-subscription.component';
import { PushSubscriptionDetailComponent } from './push-subscription-detail.component';
import { PushSubscriptionUpdateComponent } from './push-subscription-update.component';

@Injectable({ providedIn: 'root' })
export class PushSubscriptionResolve implements Resolve<IPushSubscription> {
  constructor(private service: PushSubscriptionService, private router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IPushSubscription> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        flatMap((pushSubscription: HttpResponse<PushSubscription>) => {
          if (pushSubscription.body) {
            return of(pushSubscription.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new PushSubscription());
  }
}

export const pushSubscriptionRoute: Routes = [
  {
    path: '',
    component: PushSubscriptionComponent,
    data: {
      authorities: [Authority.USER],
      pageTitle: 'instantHelpFinderApp.pushSubscription.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id/view',
    component: PushSubscriptionDetailComponent,
    resolve: {
      pushSubscription: PushSubscriptionResolve
    },
    data: {
      authorities: [Authority.USER],
      pageTitle: 'instantHelpFinderApp.pushSubscription.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: 'new',
    component: PushSubscriptionUpdateComponent,
    resolve: {
      pushSubscription: PushSubscriptionResolve
    },
    data: {
      authorities: [Authority.USER],
      pageTitle: 'instantHelpFinderApp.pushSubscription.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id/edit',
    component: PushSubscriptionUpdateComponent,
    resolve: {
      pushSubscription: PushSubscriptionResolve
    },
    data: {
      authorities: [Authority.USER],
      pageTitle: 'instantHelpFinderApp.pushSubscription.home.title'
    },
    canActivate: [UserRouteAccessService]
  }
];
