import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable, ReplaySubject } from 'rxjs';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/shared/util/request-util';
import { IUserRole } from 'app/shared/model/user-role.model';

type EntityResponseType = HttpResponse<IUserRole>;
type EntityArrayResponseType = HttpResponse<IUserRole[]>;

@Injectable({ providedIn: 'root' })
export class UserRoleService {
  private userRole: IUserRole | null = null;
  private userRoleState = new ReplaySubject<IUserRole | null>(1);
  private userRoleCache$?: Observable<IUserRole | null>;

  public resourceUrl = SERVER_API_URL + 'api/user-roles';

  constructor(protected http: HttpClient) {}

  create(userRole: IUserRole): Observable<EntityResponseType> {
    return this.http.post<IUserRole>(this.resourceUrl, userRole, { observe: 'response' });
  }

  update(userRole: IUserRole): Observable<EntityResponseType> {
    return this.http.put<IUserRole>(this.resourceUrl, userRole, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IUserRole>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  findByUserLogin(login: string): Observable<EntityResponseType> {
    return this.http.get<IUserRole>(`${this.resourceUrl}/user-login/${login}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IUserRole[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  authenticate(identity: IUserRole | null): void {
    this.userRole = identity;
    this.userRoleState.next(this.userRole);
  }

  getUserRoleState(): Observable<IUserRole | null> {
    return this.userRoleState.asObservable();
  }
}
