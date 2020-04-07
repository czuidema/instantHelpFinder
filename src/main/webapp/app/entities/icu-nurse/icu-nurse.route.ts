import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Routes, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { flatMap } from 'rxjs/operators';

import { Authority } from 'app/shared/constants/authority.constants';
import { UserRouteAccessService } from 'app/core/auth/user-route-access-service';
import { IICUNurse, ICUNurse } from 'app/shared/model/icu-nurse.model';
import { ICUNurseService } from './icu-nurse.service';
import { ICUNurseComponent } from './icu-nurse.component';
import { ICUNurseDetailComponent } from './icu-nurse-detail.component';
import { ICUNurseUpdateComponent } from './icu-nurse-update.component';

@Injectable({ providedIn: 'root' })
export class ICUNurseResolve implements Resolve<IICUNurse> {
  constructor(private service: ICUNurseService, private router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IICUNurse> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        flatMap((iCUNurse: HttpResponse<ICUNurse>) => {
          if (iCUNurse.body) {
            return of(iCUNurse.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new ICUNurse());
  }
}

export const iCUNurseRoute: Routes = [
  {
    path: '',
    component: ICUNurseComponent,
    data: {
      authorities: [Authority.USER],
      pageTitle: 'instantHelpFinderApp.iCUNurse.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id/view',
    component: ICUNurseDetailComponent,
    resolve: {
      iCUNurse: ICUNurseResolve
    },
    data: {
      authorities: [Authority.USER],
      pageTitle: 'instantHelpFinderApp.iCUNurse.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: 'new',
    component: ICUNurseUpdateComponent,
    resolve: {
      iCUNurse: ICUNurseResolve
    },
    data: {
      authorities: [Authority.USER],
      pageTitle: 'instantHelpFinderApp.iCUNurse.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id/edit',
    component: ICUNurseUpdateComponent,
    resolve: {
      iCUNurse: ICUNurseResolve
    },
    data: {
      authorities: [Authority.USER],
      pageTitle: 'instantHelpFinderApp.iCUNurse.home.title'
    },
    canActivate: [UserRouteAccessService]
  }
];
