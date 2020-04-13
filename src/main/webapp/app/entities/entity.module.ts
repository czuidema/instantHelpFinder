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
        path: 'push-subscription',
        loadChildren: () => import('./push-subscription/push-subscription.module').then(m => m.InstantHelpFinderPushSubscriptionModule)
      },
      {
        path: 'turning-event',
        loadChildren: () => import('./turning-event/turning-event.module').then(m => m.InstantHelpFinderTurningEventModule)
      }
      /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
    ])
  ]
})
export class InstantHelpFinderEntityModule {}
