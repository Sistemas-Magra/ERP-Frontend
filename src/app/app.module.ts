import { CUSTOM_ELEMENTS_SCHEMA, LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';
import localeES from '@angular/common/locales/es';
import { LoginComponent } from './seguridad/login/login.component';
import { registerLocaleData } from '@angular/common';
import {ScrollingModule} from '@angular/cdk/scrolling';
import { HeaderComponent } from './header/header.component';
import { DatePipe } from '@angular/common'

//Prime Ng
import {InputMaskModule} from 'primeng/inputmask';
import {AutoCompleteModule} from 'primeng/autocomplete';
import { MenubarModule } from 'primeng/menubar';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';
import { ButtonModule } from 'primeng/button';
import { SplitButtonModule } from 'primeng/splitbutton';
import { TabViewModule } from 'primeng/tabview';
import { SidebarModule } from 'primeng/sidebar';
import { PanelMenuModule } from 'primeng/panelmenu';
import { PasswordModule } from 'primeng/password';
import { CheckboxModule } from 'primeng/checkbox';
import { ColorPickerModule } from 'primeng/colorpicker';
import {InputTextareaModule} from 'primeng/inputtextarea';
import { CardModule } from 'primeng/card';
import { ToastModule } from 'primeng/toast';
import { TableModule } from 'primeng/table';
import { DynamicDialogModule, DialogService } from 'primeng/dynamicdialog';
import { MessageService } from 'primeng/api';
import { HttpClientModule } from '@angular/common/http';
import { MaestroUsuariosComponent } from './seguridad/maestro-usuarios/maestro-usuarios.component';
import { ModalAsignarRolesComponent } from './seguridad/maestro-usuarios/modal-asignar-roles/modal-asignar-roles.component';
import { DraggableDirective } from './commons/draggable.directive';
import { ModalSiNoComponent } from './commons/modal-si-no/modal-si-no.component';
import { ResetPasswordComponent } from './seguridad/reset-password/reset-password.component';
import { MaestroEmpleadoComponent } from './talento-humano/maestro-empleado/maestro-empleado.component';

registerLocaleData(localeES, 'es-Pe');

const routes: Routes = [
  { path: 'user/reestablecerPassword/:token', component: ResetPasswordComponent, pathMatch: 'full' },
  { path: 'users', component: MaestroUsuariosComponent, pathMatch: 'full' },
  { path: 'login', component: LoginComponent, pathMatch: 'full' },
  { path: '**', redirectTo: '', pathMatch: 'full' },
];

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HeaderComponent,
    MaestroUsuariosComponent,
    ModalAsignarRolesComponent,
    DraggableDirective,
    ModalSiNoComponent,
    ResetPasswordComponent,
    MaestroEmpleadoComponent
  ],
  imports: [
    CardModule,
    BrowserModule,
    BrowserAnimationsModule,
    AutoCompleteModule,
    MenubarModule,
    InputTextModule,
    InputMaskModule,
    DropdownModule,
    CalendarModule,
    ButtonModule,
    SplitButtonModule,
    TabViewModule,
    SidebarModule,
    PanelMenuModule,
    PasswordModule,
    CheckboxModule,
    ColorPickerModule,
    InputTextareaModule,
    CardModule,
    ToastModule,
    TableModule,
    ScrollingModule,
    DynamicDialogModule,
    FormsModule,
    HttpClientModule,
    RouterModule.forRoot(routes, {
      scrollPositionRestoration: 'top'
    })
  ],
  providers: [
    MessageService,
    DialogService,
    DatePipe,
    { provide: LOCALE_ID, useValue: 'es-Pe' },
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }
