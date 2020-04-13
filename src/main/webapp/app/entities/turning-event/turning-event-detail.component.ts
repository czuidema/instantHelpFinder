import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ITurningEvent } from 'app/shared/model/turning-event.model';

@Component({
  selector: 'jhi-turning-event-detail',
  templateUrl: './turning-event-detail.component.html'
})
export class TurningEventDetailComponent implements OnInit {
  turningEvent: ITurningEvent | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ turningEvent }) => (this.turningEvent = turningEvent));
  }

  previousState(): void {
    window.history.back();
  }
}
