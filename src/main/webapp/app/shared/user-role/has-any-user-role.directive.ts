import { Directive, Input, OnDestroy, TemplateRef, ViewContainerRef } from '@angular/core';
import { Subscription } from 'rxjs';
import { UserRoleService } from 'app/entities/user-role/user-role.service';
import { AccountService } from 'app/core/auth/account.service';

@Directive({
  selector: '[jhiHasAnyUserRoleDir]'
})
export class HasAnyUserRoleDirective implements OnDestroy {
  private userRoles: string[] = [];
  private authenticationSubscription?: Subscription;

  constructor(
    private userRoleService: UserRoleService,
    private accountService: AccountService,
    private templateRef: TemplateRef<any>,
    private viewContainerRef: ViewContainerRef
  ) {}

  @Input()
  set jhiHasAnyUserRoleDir(value: string | string[]) {
    this.userRoles = typeof value === 'string' ? [value] : value;
    this.updateView();
    // Get notified each time authentication state changes.
    this.authenticationSubscription = this.accountService.getAuthenticationState().subscribe(() => this.updateView());
  }

  ngOnDestroy(): void {
    if (this.authenticationSubscription) {
      this.authenticationSubscription.unsubscribe();
    }
  }

  private updateView(): void {
    const hasAnyUserRole = this.accountService.hasAnyUserRole(this.userRoles);
    this.viewContainerRef.clear();
    if (hasAnyUserRole) {
      this.viewContainerRef.createEmbeddedView(this.templateRef);
    }
  }
}
