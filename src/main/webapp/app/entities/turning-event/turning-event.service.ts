import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/shared/util/request-util';
import { ITurningEvent } from 'app/shared/model/turning-event.model';

type EntityResponseType = HttpResponse<ITurningEvent>;
type EntityArrayResponseType = HttpResponse<ITurningEvent[]>;

@Injectable({ providedIn: 'root' })
export class TurningEventService {
  public resourceUrl = SERVER_API_URL + 'api/turning-events';

  constructor(protected http: HttpClient) {}

  create(turningEvent: ITurningEvent): Observable<EntityResponseType> {
    return this.http.post<ITurningEvent>(this.resourceUrl, turningEvent, { observe: 'response' });
  }

  update(turningEvent: ITurningEvent): Observable<EntityResponseType> {
    return this.http.put<ITurningEvent>(this.resourceUrl, turningEvent, { observe: 'response' });
  }

  acceptTurningEventDoctor(doctorId: number, turningEventId: number): Observable<EntityResponseType> {
    return this.http.put<ITurningEvent>(`${this.resourceUrl}/doctors/${doctorId}`, turningEventId, { observe: 'response' });
  }

  acceptTurningEventAssistant(assistantId: number, turningEventId: number): Observable<EntityResponseType> {
    return this.http.put<ITurningEvent>(`${this.resourceUrl}/assistants/${assistantId}`, turningEventId, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<ITurningEvent>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<ITurningEvent[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  queryTasks(candidateGroupName: string, req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<ITurningEvent[]>(`${this.resourceUrl}/open/${candidateGroupName}`, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }
}
