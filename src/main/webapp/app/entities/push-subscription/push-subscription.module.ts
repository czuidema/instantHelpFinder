import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { InstantHelpFinderSharedModule } from 'app/shared/shared.module';
import { PushSubscriptionComponent } from './push-subscription.component';
import { PushSubscriptionDetailComponent } from './push-subscription-detail.component';
import { PushSubscriptionUpdateComponent } from './push-subscription-update.component';
import { PushSubscriptionDeleteDialogComponent } from './push-subscription-delete-dialog.component';
import { pushSubscriptionRoute } from './push-subscription.route';

@NgModule({
  imports: [InstantHelpFinderSharedModule, RouterModule.forChild(pushSubscriptionRoute)],
  declarations: [
    PushSubscriptionComponent,
    PushSubscriptionDetailComponent,
    PushSubscriptionUpdateComponent,
    PushSubscriptionDeleteDialogComponent
  ],
  entryComponents: [PushSubscriptionDeleteDialogComponent]
})
export class InstantHelpFinderPushSubscriptionModule {}
