import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/shared/util/request-util';
import { IAssistant } from 'app/shared/model/assistant.model';

type EntityResponseType = HttpResponse<IAssistant>;
type EntityArrayResponseType = HttpResponse<IAssistant[]>;

@Injectable({ providedIn: 'root' })
export class AssistantService {
  public resourceUrl = SERVER_API_URL + 'api/assistants';

  constructor(protected http: HttpClient) {}

  create(assistant: IAssistant): Observable<EntityResponseType> {
    return this.http.post<IAssistant>(this.resourceUrl, assistant, { observe: 'response' });
  }

  update(assistant: IAssistant): Observable<EntityResponseType> {
    return this.http.put<IAssistant>(this.resourceUrl, assistant, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IAssistant>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IAssistant[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }
}
