import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IAssistant } from 'app/shared/model/assistant.model';

@Component({
  selector: 'jhi-assistant-detail',
  templateUrl: './assistant-detail.component.html'
})
export class AssistantDetailComponent implements OnInit {
  assistant: IAssistant | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ assistant }) => (this.assistant = assistant));
  }

  previousState(): void {
    window.history.back();
  }
}
