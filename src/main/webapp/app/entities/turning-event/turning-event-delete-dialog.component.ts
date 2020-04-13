import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { ITurningEvent } from 'app/shared/model/turning-event.model';
import { TurningEventService } from './turning-event.service';

@Component({
  templateUrl: './turning-event-delete-dialog.component.html'
})
export class TurningEventDeleteDialogComponent {
  turningEvent?: ITurningEvent;

  constructor(
    protected turningEventService: TurningEventService,
    public activeModal: NgbActiveModal,
    protected eventManager: JhiEventManager
  ) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.turningEventService.delete(id).subscribe(() => {
      this.eventManager.broadcast('turningEventListModification');
      this.activeModal.close();
    });
  }
}
