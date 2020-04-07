import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';

import { IICUNurse, ICUNurse } from 'app/shared/model/icu-nurse.model';
import { ICUNurseService } from './icu-nurse.service';

@Component({
  selector: 'jhi-icu-nurse-update',
  templateUrl: './icu-nurse-update.component.html'
})
export class ICUNurseUpdateComponent implements OnInit {
  isSaving = false;

  editForm = this.fb.group({
    id: []
  });

  constructor(protected iCUNurseService: ICUNurseService, protected activatedRoute: ActivatedRoute, private fb: FormBuilder) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ iCUNurse }) => {
      this.updateForm(iCUNurse);
    });
  }

  updateForm(iCUNurse: IICUNurse): void {
    this.editForm.patchValue({
      id: iCUNurse.id
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const iCUNurse = this.createFromForm();
    if (iCUNurse.id !== undefined) {
      this.subscribeToSaveResponse(this.iCUNurseService.update(iCUNurse));
    } else {
      this.subscribeToSaveResponse(this.iCUNurseService.create(iCUNurse));
    }
  }

  private createFromForm(): IICUNurse {
    return {
      ...new ICUNurse(),
      id: this.editForm.get(['id'])!.value
    };
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IICUNurse>>): void {
    result.subscribe(
      () => this.onSaveSuccess(),
      () => this.onSaveError()
    );
  }

  protected onSaveSuccess(): void {
    this.isSaving = false;
    this.previousState();
  }

  protected onSaveError(): void {
    this.isSaving = false;
  }
}
