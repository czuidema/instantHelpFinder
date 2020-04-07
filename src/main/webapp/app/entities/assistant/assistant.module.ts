import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { InstantHelpFinderSharedModule } from 'app/shared/shared.module';
import { AssistantComponent } from './assistant.component';
import { AssistantDetailComponent } from './assistant-detail.component';
import { AssistantUpdateComponent } from './assistant-update.component';
import { AssistantDeleteDialogComponent } from './assistant-delete-dialog.component';
import { assistantRoute } from './assistant.route';

@NgModule({
  imports: [InstantHelpFinderSharedModule, RouterModule.forChild(assistantRoute)],
  declarations: [AssistantComponent, AssistantDetailComponent, AssistantUpdateComponent, AssistantDeleteDialogComponent],
  entryComponents: [AssistantDeleteDialogComponent]
})
export class InstantHelpFinderAssistantModule {}
