import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Routes, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { flatMap } from 'rxjs/operators';

import { Authority } from 'app/shared/constants/authority.constants';
import { UserRouteAccessService } from 'app/core/auth/user-route-access-service';
import { ITurningEvent, TurningEvent } from 'app/shared/model/turning-event.model';
import { TurningEventService } from './turning-event.service';
import { TurningEventComponent } from './turning-event.component';
import { TurningEventDetailComponent } from './turning-event-detail.component';
import { TurningEventUpdateComponent } from './turning-event-update.component';

@Injectable({ providedIn: 'root' })
export class TurningEventResolve implements Resolve<ITurningEvent> {
  constructor(private service: TurningEventService, private router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<ITurningEvent> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        flatMap((turningEvent: HttpResponse<TurningEvent>) => {
          if (turningEvent.body) {
            return of(turningEvent.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new TurningEvent());
  }
}

export const turningEventRoute: Routes = [
  {
    path: '',
    component: TurningEventComponent,
    data: {
      authorities: [Authority.USER],
      pageTitle: 'instantHelpFinderApp.turningEvent.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id/view',
    component: TurningEventDetailComponent,
    resolve: {
      turningEvent: TurningEventResolve
    },
    data: {
      authorities: [Authority.USER],
      pageTitle: 'instantHelpFinderApp.turningEvent.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: 'new',
    component: TurningEventUpdateComponent,
    resolve: {
      turningEvent: TurningEventResolve
    },
    data: {
      authorities: [Authority.USER],
      pageTitle: 'instantHelpFinderApp.turningEvent.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id/edit',
    component: TurningEventUpdateComponent,
    resolve: {
      turningEvent: TurningEventResolve
    },
    data: {
      authorities: [Authority.USER],
      pageTitle: 'instantHelpFinderApp.turningEvent.home.title'
    },
    canActivate: [UserRouteAccessService]
  }
];
