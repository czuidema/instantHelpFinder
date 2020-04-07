import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { IICUNurse } from 'app/shared/model/icu-nurse.model';
import { ICUNurseService } from './icu-nurse.service';

@Component({
  templateUrl: './icu-nurse-delete-dialog.component.html'
})
export class ICUNurseDeleteDialogComponent {
  iCUNurse?: IICUNurse;

  constructor(protected iCUNurseService: ICUNurseService, public activeModal: NgbActiveModal, protected eventManager: JhiEventManager) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.iCUNurseService.delete(id).subscribe(() => {
      this.eventManager.broadcast('iCUNurseListModification');
      this.activeModal.close();
    });
  }
}
