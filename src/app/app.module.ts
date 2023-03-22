import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { RouterModule, Routes } from '@angular/router';
import localeES from '@angular/common/locales/es';
import { LoginComponent } from './seguridad/login/login.component';
import { registerLocaleData } from '@angular/common';

registerLocaleData(localeES, 'es-Pe');

const routes: Routes = [
  { path: 'login', component: LoginComponent, pathMatch: 'full' },
  { path: '**', redirectTo: '/login', pathMatch: 'full' },
];

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(routes, {
      scrollPositionRestoration: 'top'
    })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
