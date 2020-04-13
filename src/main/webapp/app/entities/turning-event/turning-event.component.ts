import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { JhiEventManager } from 'ng-jhipster';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { ITurningEvent } from 'app/shared/model/turning-event.model';
import { TurningEventService } from './turning-event.service';
import { TurningEventDeleteDialogComponent } from './turning-event-delete-dialog.component';

@Component({
  selector: 'jhi-turning-event',
  templateUrl: './turning-event.component.html'
})
export class TurningEventComponent implements OnInit, OnDestroy {
  turningEvents?: ITurningEvent[];
  eventSubscriber?: Subscription;

  constructor(
    protected turningEventService: TurningEventService,
    protected eventManager: JhiEventManager,
    protected modalService: NgbModal
  ) {}

  loadAll(): void {
    this.turningEventService.query().subscribe((res: HttpResponse<ITurningEvent[]>) => (this.turningEvents = res.body || []));
  }

  ngOnInit(): void {
    this.loadAll();
    this.registerChangeInTurningEvents();
  }

  ngOnDestroy(): void {
    if (this.eventSubscriber) {
      this.eventManager.destroy(this.eventSubscriber);
    }
  }

  trackId(index: number, item: ITurningEvent): number {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
    return item.id!;
  }

  registerChangeInTurningEvents(): void {
    this.eventSubscriber = this.eventManager.subscribe('turningEventListModification', () => this.loadAll());
  }

  delete(turningEvent: ITurningEvent): void {
    const modalRef = this.modalService.open(TurningEventDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.turningEvent = turningEvent;
  }
}
