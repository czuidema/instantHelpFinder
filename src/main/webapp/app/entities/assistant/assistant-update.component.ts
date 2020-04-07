import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';

import { IAssistant, Assistant } from 'app/shared/model/assistant.model';
import { AssistantService } from './assistant.service';

@Component({
  selector: 'jhi-assistant-update',
  templateUrl: './assistant-update.component.html'
})
export class AssistantUpdateComponent implements OnInit {
  isSaving = false;

  editForm = this.fb.group({
    id: []
  });

  constructor(protected assistantService: AssistantService, protected activatedRoute: ActivatedRoute, private fb: FormBuilder) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ assistant }) => {
      this.updateForm(assistant);
    });
  }

  updateForm(assistant: IAssistant): void {
    this.editForm.patchValue({
      id: assistant.id
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const assistant = this.createFromForm();
    if (assistant.id !== undefined) {
      this.subscribeToSaveResponse(this.assistantService.update(assistant));
    } else {
      this.subscribeToSaveResponse(this.assistantService.create(assistant));
    }
  }

  private createFromForm(): IAssistant {
    return {
      ...new Assistant(),
      id: this.editForm.get(['id'])!.value
    };
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IAssistant>>): void {
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
