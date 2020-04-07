import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/shared/util/request-util';
import { IRequest } from 'app/shared/model/request.model';

type EntityResponseType = HttpResponse<IRequest>;
type EntityArrayResponseType = HttpResponse<IRequest[]>;

@Injectable({ providedIn: 'root' })
export class RequestService {
  public resourceUrl = SERVER_API_URL + 'api/requests';

  constructor(protected http: HttpClient) {}

  create(request: IRequest): Observable<EntityResponseType> {
    return this.http.post<IRequest>(this.resourceUrl, request, { observe: 'response' });
  }

  update(request: IRequest): Observable<EntityResponseType> {
    return this.http.put<IRequest>(this.resourceUrl, request, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IRequest>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IRequest[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }
}
