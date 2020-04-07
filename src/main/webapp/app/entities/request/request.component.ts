import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { JhiEventManager } from 'ng-jhipster';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IRequest } from 'app/shared/model/request.model';
import { RequestService } from './request.service';
import { RequestDeleteDialogComponent } from './request-delete-dialog.component';

@Component({
  selector: 'jhi-request',
  templateUrl: './request.component.html'
})
export class RequestComponent implements OnInit, OnDestroy {
  requests?: IRequest[];
  eventSubscriber?: Subscription;

  constructor(protected requestService: RequestService, protected eventManager: JhiEventManager, protected modalService: NgbModal) {}

  loadAll(): void {
    this.requestService.query().subscribe((res: HttpResponse<IRequest[]>) => (this.requests = res.body || []));
  }

  ngOnInit(): void {
    this.loadAll();
    this.registerChangeInRequests();
  }

  ngOnDestroy(): void {
    if (this.eventSubscriber) {
      this.eventManager.destroy(this.eventSubscriber);
    }
  }

  trackId(index: number, item: IRequest): number {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
    return item.id!;
  }

  registerChangeInRequests(): void {
    this.eventSubscriber = this.eventManager.subscribe('requestListModification', () => this.loadAll());
  }

  delete(request: IRequest): void {
    const modalRef = this.modalService.open(RequestDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.request = request;
  }
}
