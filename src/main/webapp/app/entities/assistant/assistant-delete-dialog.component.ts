import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { IAssistant } from 'app/shared/model/assistant.model';
import { AssistantService } from './assistant.service';

@Component({
  templateUrl: './assistant-delete-dialog.component.html'
})
export class AssistantDeleteDialogComponent {
  assistant?: IAssistant;

  constructor(protected assistantService: AssistantService, public activeModal: NgbActiveModal, protected eventManager: JhiEventManager) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.assistantService.delete(id).subscribe(() => {
      this.eventManager.broadcast('assistantListModification');
      this.activeModal.close();
    });
  }
}
