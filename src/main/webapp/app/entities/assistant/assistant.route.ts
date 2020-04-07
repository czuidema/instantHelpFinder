import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Routes, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { flatMap } from 'rxjs/operators';

import { Authority } from 'app/shared/constants/authority.constants';
import { UserRouteAccessService } from 'app/core/auth/user-route-access-service';
import { IAssistant, Assistant } from 'app/shared/model/assistant.model';
import { AssistantService } from './assistant.service';
import { AssistantComponent } from './assistant.component';
import { AssistantDetailComponent } from './assistant-detail.component';
import { AssistantUpdateComponent } from './assistant-update.component';

@Injectable({ providedIn: 'root' })
export class AssistantResolve implements Resolve<IAssistant> {
  constructor(private service: AssistantService, private router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IAssistant> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        flatMap((assistant: HttpResponse<Assistant>) => {
          if (assistant.body) {
            return of(assistant.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Assistant());
  }
}

export const assistantRoute: Routes = [
  {
    path: '',
    component: AssistantComponent,
    data: {
      authorities: [Authority.USER],
      pageTitle: 'instantHelpFinderApp.assistant.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id/view',
    component: AssistantDetailComponent,
    resolve: {
      assistant: AssistantResolve
    },
    data: {
      authorities: [Authority.USER],
      pageTitle: 'instantHelpFinderApp.assistant.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: 'new',
    component: AssistantUpdateComponent,
    resolve: {
      assistant: AssistantResolve
    },
    data: {
      authorities: [Authority.USER],
      pageTitle: 'instantHelpFinderApp.assistant.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id/edit',
    component: AssistantUpdateComponent,
    resolve: {
      assistant: AssistantResolve
    },
    data: {
      authorities: [Authority.USER],
      pageTitle: 'instantHelpFinderApp.assistant.home.title'
    },
    canActivate: [UserRouteAccessService]
  }
];
