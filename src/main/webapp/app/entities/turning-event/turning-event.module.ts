import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { InstantHelpFinderSharedModule } from 'app/shared/shared.module';
import { TurningEventComponent } from './turning-event.component';
import { TurningEventDetailComponent } from './turning-event-detail.component';
import { TurningEventUpdateComponent } from './turning-event-update.component';
import { TurningEventDeleteDialogComponent } from './turning-event-delete-dialog.component';
import { turningEventRoute } from './turning-event.route';

@NgModule({
  imports: [InstantHelpFinderSharedModule, RouterModule.forChild(turningEventRoute)],
  declarations: [TurningEventComponent, TurningEventDetailComponent, TurningEventUpdateComponent, TurningEventDeleteDialogComponent],
  entryComponents: [TurningEventDeleteDialogComponent]
})
export class InstantHelpFinderTurningEventModule {}
