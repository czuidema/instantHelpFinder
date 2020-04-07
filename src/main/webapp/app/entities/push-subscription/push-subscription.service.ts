import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/shared/util/request-util';
import { IPushSubscription } from 'app/shared/model/push-subscription.model';

type EntityResponseType = HttpResponse<IPushSubscription>;
type EntityArrayResponseType = HttpResponse<IPushSubscription[]>;

@Injectable({ providedIn: 'root' })
export class PushSubscriptionService {
  public resourceUrl = SERVER_API_URL + 'api/push-subscriptions';

  constructor(protected http: HttpClient) {}

  create(pushSubscription: IPushSubscription): Observable<EntityResponseType> {
    return this.http.post<IPushSubscription>(this.resourceUrl, pushSubscription, { observe: 'response' });
  }

  update(pushSubscription: IPushSubscription): Observable<EntityResponseType> {
    return this.http.put<IPushSubscription>(this.resourceUrl, pushSubscription, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IPushSubscription>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IPushSubscription[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }
}
