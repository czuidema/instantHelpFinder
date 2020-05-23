import { NgModule } from '@angular/core';
import { InstantHelpFinderSharedLibsModule } from './shared-libs.module';
import { FindLanguageFromKeyPipe } from './language/find-language-from-key.pipe';
import { AlertComponent } from './alert/alert.component';
import { AlertErrorComponent } from './alert/alert-error.component';
import { LoginModalComponent } from './login/login.component';
import { HasAnyAuthorityDirective } from './auth/has-any-authority.directive';
import { HasAnyUserRoleDirective } from 'app/shared/user-role/has-any-user-role.directive';

@NgModule({
  imports: [InstantHelpFinderSharedLibsModule],
  declarations: [
    FindLanguageFromKeyPipe,
    AlertComponent,
    AlertErrorComponent,
    LoginModalComponent,
    HasAnyAuthorityDirective,
    HasAnyUserRoleDirective
  ],
  entryComponents: [LoginModalComponent],
  exports: [
    InstantHelpFinderSharedLibsModule,
    FindLanguageFromKeyPipe,
    AlertComponent,
    AlertErrorComponent,
    LoginModalComponent,
    HasAnyAuthorityDirective,
    HasAnyUserRoleDirective
  ]
})
export class InstantHelpFinderSharedModule {}
