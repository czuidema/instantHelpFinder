import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IICUNurse } from 'app/shared/model/icu-nurse.model';

@Component({
  selector: 'jhi-icu-nurse-detail',
  templateUrl: './icu-nurse-detail.component.html'
})
export class ICUNurseDetailComponent implements OnInit {
  iCUNurse: IICUNurse | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ iCUNurse }) => (this.iCUNurse = iCUNurse));
  }

  previousState(): void {
    window.history.back();
  }
}
