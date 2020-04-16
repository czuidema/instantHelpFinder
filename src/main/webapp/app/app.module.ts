import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import './vendor';
import { InstantHelpFinderSharedModule } from 'app/shared/shared.module';
import { InstantHelpFinderCoreModule } from 'app/core/core.module';
import { InstantHelpFinderAppRoutingModule } from './app-routing.module';
import { InstantHelpFinderHomeModule } from './home/home.module';
import { InstantHelpFinderEntityModule } from './entities/entity.module';
// jhipster-needle-angular-add-module-import JHipster will add new module here
import { MainComponent } from './layouts/main/main.component';
import { NavbarComponent } from './layouts/navbar/navbar.component';
import { FooterComponent } from './layouts/footer/footer.component';
import { PageRibbonComponent } from './layouts/profiles/page-ribbon.component';
import { ActiveMenuDirective } from './layouts/navbar/active-menu.directive';
import { ErrorComponent } from './layouts/error/error.component';
import { BrowserAnimationsModule, NoopAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
  imports: [
    BrowserModule,
    NoopAnimationsModule,
    BrowserAnimationsModule,
    InstantHelpFinderSharedModule,
    InstantHelpFinderCoreModule,
    InstantHelpFinderHomeModule,
    // jhipster-needle-angular-add-module JHipster will add new module here
    InstantHelpFinderEntityModule,
    InstantHelpFinderAppRoutingModule
  ],
  declarations: [MainComponent, NavbarComponent, ErrorComponent, PageRibbonComponent, ActiveMenuDirective, FooterComponent],
  bootstrap: [MainComponent]
})
export class InstantHelpFinderAppModule {}
