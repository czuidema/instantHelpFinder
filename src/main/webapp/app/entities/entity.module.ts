import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'user-role',
        loadChildren: () => import('./user-role/user-role.module').then(m => m.InstantHelpFinderUserRoleModule)
      },
      {
        path: 'doctor',
        loadChildren: () => import('./doctor/doctor.module').then(m => m.InstantHelpFinderDoctorModule)
      },
      {
        path: 'icu-nurse',
        loadChildren: () => import('./icu-nurse/icu-nurse.module').then(m => m.InstantHelpFinderICUNurseModule)
      },
      {
        path: 'assistant',
        loadChildren: () => import('./assistant/assistant.module').then(m => m.InstantHelpFinderAssistantModule)
      },
      {
        path: 'request',
        loadChildren: () => import('./request/request.module').then(m => m.InstantHelpFinderRequestModule)
      },
      {
        path: 'push-subscription',
        loadChildren: () => import('./push-subscription/push-subscription.module').then(m => m.InstantHelpFinderPushSubscriptionModule)
      }
      /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
    ])
  ]
})
export class InstantHelpFinderEntityModule {}
