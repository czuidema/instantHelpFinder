import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable, of, ReplaySubject } from 'rxjs';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/shared/util/request-util';
import { IUserRole } from 'app/shared/model/user-role.model';
import { Account } from 'app/core/user/account.model';
import { catchError, shareReplay, tap } from 'rxjs/operators';
import { AccountService } from 'app/core/auth/account.service';

type EntityResponseType = HttpResponse<IUserRole>;
type EntityArrayResponseType = HttpResponse<IUserRole[]>;

@Injectable({ providedIn: 'root' })
export class UserRoleService {
  private userRole: IUserRole | null = null;
  private userRoleState = new ReplaySubject<IUserRole | null>(1);
  private userRoleCache$?: Observable<IUserRole | null>;

  public resourceUrl = SERVER_API_URL + 'api/user-roles';

  constructor(protected http: HttpClient, protected accountService: AccountService) {}

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

  hasAnyUserRole(userRoles: string[] | string): boolean {
    if (!this.userRole || !this.userRole.dtype) {
      return false;
    }
    if (!Array.isArray(userRoles)) {
      userRoles = [userRoles];
    }
    return userRoles.some((userRole: string) => this.userRole?.dtype === userRole);
  }

  getUserRoleState(): Observable<IUserRole | null> {
    return this.userRoleState.asObservable();
  }
}
