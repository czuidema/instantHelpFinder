import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { JhiLanguageService } from 'ng-jhipster';
import { SessionStorageService } from 'ngx-webstorage';
import { Observable, ReplaySubject, of } from 'rxjs';
import { shareReplay, tap, catchError } from 'rxjs/operators';
import { StateStorageService } from 'app/core/auth/state-storage.service';
import { UserRoleService } from 'app/entities/user-role/user-role.service';

import { SERVER_API_URL } from 'app/app.constants';
import { Account } from 'app/core/user/account.model';
import { IUserRole, UserRole } from 'app/shared/model/user-role.model';

@Injectable({ providedIn: 'root' })
export class AccountService {
  private userIdentity: Account | null = null;
  private authenticationState = new ReplaySubject<Account | null>(1);
  private accountCache$?: Observable<Account | null>;
  private userRole?: IUserRole;

  constructor(
    private languageService: JhiLanguageService,
    private sessionStorage: SessionStorageService,
    private http: HttpClient,
    private stateStorageService: StateStorageService,
    private userRoleService: UserRoleService,
    private router: Router
  ) {}

  save(account: Account): Observable<{}> {
    return this.http.post(SERVER_API_URL + 'api/account', account);
  }

  authenticate(identity: Account | null): void {
    this.userIdentity = identity;
    const login = this.userIdentity?.login;

    if (login) {
      this.userRoleService.findByUserLogin(login).subscribe((res: HttpResponse<IUserRole>) => {
        this.userRole = res.body || undefined;
        this.authenticationState.next(this.userIdentity);
      });
    } else {
      // if there is no login create an empty user role.
      this.userRole = new UserRole();
      this.authenticationState.next(this.userIdentity);
    }
  }

  hasAnyAuthority(authorities: string[] | string): boolean {
    if (!this.userIdentity || !this.userIdentity.authorities) {
      return false;
    }
    if (!Array.isArray(authorities)) {
      authorities = [authorities];
    }
    return this.userIdentity.authorities.some((authority: string) => authorities.includes(authority));
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

  identity(force?: boolean): Observable<Account | null> {
    if (!this.accountCache$ || force || !this.isAuthenticated()) {
      this.accountCache$ = this.fetch().pipe(
        catchError(() => {
          return of(null);
        }),
        tap((account: Account | null) => {
          this.authenticate(account);

          // After retrieve the account info, the language will be changed to
          // the user's preferred language configured in the account setting
          if (account && account.langKey) {
            const langKey = this.sessionStorage.retrieve('locale') || account.langKey;
            this.languageService.changeLanguage(langKey);
          }

          if (account) {
            this.navigateToStoredUrl();
          }
        }),
        shareReplay()
      );
    }
    return this.accountCache$;
  }

  isAuthenticated(): boolean {
    return this.userIdentity !== null;
  }

  getAuthenticationState(): Observable<Account | null> {
    return this.authenticationState.asObservable();
  }

  getImageUrl(): string {
    return this.userIdentity ? this.userIdentity.imageUrl : '';
  }

  private fetch(): Observable<Account> {
    return this.http.get<Account>(SERVER_API_URL + 'api/account');
  }

  private navigateToStoredUrl(): void {
    // previousState can be set in the authExpiredInterceptor and in the userRouteAccessService
    // if login is successful, go to stored previousState and clear previousState
    const previousUrl = this.stateStorageService.getUrl();
    if (previousUrl) {
      this.stateStorageService.clearUrl();
      this.router.navigateByUrl(previousUrl);
    }
  }
}
