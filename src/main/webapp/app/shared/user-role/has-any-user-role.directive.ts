import { Directive, Input, OnDestroy, TemplateRef, ViewContainerRef } from '@angular/core';
import { Subscription } from 'rxjs';
import { UserRoleService } from 'app/entities/user-role/user-role.service';

@Directive({
  selector: '[jhiHasAnyUserRole]'
})
export class HasAnyUserRoleDirective implements OnDestroy {
  private userRoles: string[] = [];
  private userRoleSubscription?: Subscription;

  constructor(
    private userRoleService: UserRoleService,
    private templateRef: TemplateRef<any>,
    private viewContainerRef: ViewContainerRef
  ) {}

  @Input()
  set jhiHasAnyUserRole(value: string | string[]) {
    this.userRoles = typeof value === 'string' ? [value] : value;
    this.updateView();
    // Get notified each time authentication state changes.
    // this.authenticationSubscription = this.accountService.getAuthenticationState().subscribe(() => this.updateView());
  }

  ngOnDestroy(): void {}

  private updateView(): void {
    const hasAnyUserRole = this.userRoleService.hasAnyUserRole(this.userRoles);
    this.viewContainerRef.clear();
    if (hasAnyUserRole) {
      this.viewContainerRef.createEmbeddedView(this.templateRef);
    }
  }
}
