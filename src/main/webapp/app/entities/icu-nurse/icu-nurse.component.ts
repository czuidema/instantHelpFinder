import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { JhiEventManager } from 'ng-jhipster';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IICUNurse } from 'app/shared/model/icu-nurse.model';
import { ICUNurseService } from './icu-nurse.service';
import { ICUNurseDeleteDialogComponent } from './icu-nurse-delete-dialog.component';

@Component({
  selector: 'jhi-icu-nurse',
  templateUrl: './icu-nurse.component.html'
})
export class ICUNurseComponent implements OnInit, OnDestroy {
  iCUNurses?: IICUNurse[];
  eventSubscriber?: Subscription;

  constructor(protected iCUNurseService: ICUNurseService, protected eventManager: JhiEventManager, protected modalService: NgbModal) {}

  loadAll(): void {
    this.iCUNurseService.query().subscribe((res: HttpResponse<IICUNurse[]>) => (this.iCUNurses = res.body || []));
  }

  ngOnInit(): void {
    this.loadAll();
    this.registerChangeInICUNurses();
  }

  ngOnDestroy(): void {
    if (this.eventSubscriber) {
      this.eventManager.destroy(this.eventSubscriber);
    }
  }

  trackId(index: number, item: IICUNurse): number {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
    return item.id!;
  }

  registerChangeInICUNurses(): void {
    this.eventSubscriber = this.eventManager.subscribe('iCUNurseListModification', () => this.loadAll());
  }

  delete(iCUNurse: IICUNurse): void {
    const modalRef = this.modalService.open(ICUNurseDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.iCUNurse = iCUNurse;
  }
}
