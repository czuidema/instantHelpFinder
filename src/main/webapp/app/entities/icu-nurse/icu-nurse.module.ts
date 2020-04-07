import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { InstantHelpFinderSharedModule } from 'app/shared/shared.module';
import { ICUNurseComponent } from './icu-nurse.component';
import { ICUNurseDetailComponent } from './icu-nurse-detail.component';
import { ICUNurseUpdateComponent } from './icu-nurse-update.component';
import { ICUNurseDeleteDialogComponent } from './icu-nurse-delete-dialog.component';
import { iCUNurseRoute } from './icu-nurse.route';

@NgModule({
  imports: [InstantHelpFinderSharedModule, RouterModule.forChild(iCUNurseRoute)],
  declarations: [ICUNurseComponent, ICUNurseDetailComponent, ICUNurseUpdateComponent, ICUNurseDeleteDialogComponent],
  entryComponents: [ICUNurseDeleteDialogComponent]
})
export class InstantHelpFinderICUNurseModule {}
