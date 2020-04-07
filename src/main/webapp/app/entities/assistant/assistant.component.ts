import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { JhiEventManager } from 'ng-jhipster';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IAssistant } from 'app/shared/model/assistant.model';
import { AssistantService } from './assistant.service';
import { AssistantDeleteDialogComponent } from './assistant-delete-dialog.component';

@Component({
  selector: 'jhi-assistant',
  templateUrl: './assistant.component.html'
})
export class AssistantComponent implements OnInit, OnDestroy {
  assistants?: IAssistant[];
  eventSubscriber?: Subscription;

  constructor(protected assistantService: AssistantService, protected eventManager: JhiEventManager, protected modalService: NgbModal) {}

  loadAll(): void {
    this.assistantService.query().subscribe((res: HttpResponse<IAssistant[]>) => (this.assistants = res.body || []));
  }

  ngOnInit(): void {
    this.loadAll();
    this.registerChangeInAssistants();
  }

  ngOnDestroy(): void {
    if (this.eventSubscriber) {
      this.eventManager.destroy(this.eventSubscriber);
    }
  }

  trackId(index: number, item: IAssistant): number {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
    return item.id!;
  }

  registerChangeInAssistants(): void {
    this.eventSubscriber = this.eventManager.subscribe('assistantListModification', () => this.loadAll());
  }

  delete(assistant: IAssistant): void {
    const modalRef = this.modalService.open(AssistantDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.assistant = assistant;
  }
}
