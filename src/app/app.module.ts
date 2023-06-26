import { CUSTOM_ELEMENTS_SCHEMA, LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';
import localeES from '@angular/common/locales/es';

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
import {MultiSelectModule} from 'primeng/multiselect';
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
import { EmpleadoDetalleComponent } from './talento-humano/empleado-detalle/empleado-detalle.component';
import { ModalAgregarAuxiliarComponent } from './commons/modal-agregar-auxiliar/modal-agregar-auxiliar.component';
import { ModalHijosEmpleadoComponent } from './talento-humano/empleado-detalle/modal-hijos-empleado/modal-hijos-empleado.component';
import { ContextMenuModule } from 'primeng/contextmenu';
import { InputNumberModule } from 'primeng/inputnumber';
import { ModalRegistroVacacionesComponent } from './talento-humano/maestro-empleado/modal-registro-vacaciones/modal-registro-vacaciones.component';
import { ModalRegistroPermisosComponent } from './talento-humano/maestro-empleado/modal-registro-permisos/modal-registro-permisos.component';
import { ModalRegistroCesesComponent } from './talento-humano/maestro-empleado/modal-registro-ceses/modal-registro-ceses.component';
import { ModalListadoVacacionesComponent } from './talento-humano/maestro-empleado/modal-listado-vacaciones/modal-listado-vacaciones.component';
import { ModalListadoPermisosComponent } from './talento-humano/maestro-empleado/modal-listado-permisos/modal-listado-permisos.component';
import { ModalRegistrarContratoComponent } from './talento-humano/maestro-empleado/modal-registrar-contrato/modal-registrar-contrato.component';
import { ModalMostrarContratoComponent } from './talento-humano/maestro-empleado/modal-mostrar-contrato/modal-mostrar-contrato.component';
import { ModalRegistrarAsistenciaComponent } from './talento-humano/maestro-empleado/modal-registrar-asistencia/modal-registrar-asistencia.component';
import { ModalRegistroHorarioComponent } from './talento-humano/empleado-detalle/modal-registro-horario/modal-registro-horario.component';
import { CotizacionesComponent } from './ventas/cotizaciones/cotizaciones.component';
import { CotizacionesDetalleComponent } from './ventas/cotizaciones-detalle/cotizaciones-detalle.component';
import { AlmacenComponent } from './logistica/almacen/almacen.component';
import { MaestroRequerimientoCompraComponent } from './logistica/maestro-requerimiento-compra/maestro-requerimiento-compra.component';
import { RegistroRequerimientoCompraComponent } from './logistica/registro-requerimiento-compra/registro-requerimiento-compra.component';
import { ReporteActosComponent } from './seguridad-trabajo/reporte-actos/reporte-actos.component';
import { RegistroReporteActosComponent } from './seguridad-trabajo/reporte-actos/registro-reporte-actos/registro-reporte-actos.component';
import { ModalAgregarActoCondicionComponent } from './seguridad-trabajo/reporte-actos/registro-reporte-actos/modal-agregar-acto-condicion/modal-agregar-acto-condicion.component';
import { ModalAgregarContactoClienteComponent } from './ventas/cotizaciones-detalle/modal-agregar-contacto-cliente/modal-agregar-contacto-cliente.component';
import { ModalRegistroDespachosComponent } from './ventas/cotizaciones-detalle/modal-registro-despachos/modal-registro-despachos.component';
import { ModalRegistroProductosDespachosComponent } from './ventas/cotizaciones-detalle/modal-registro-despachos/modal-registro-productos-despachos/modal-registro-productos-despachos.component';
import { ProgramacionProduccionSemanalComponent } from './produccion/programacion-produccion-semanal/programacion-produccion-semanal.component';
import { LoginComponent } from './seguridad/login/login.component';
import { ListadoProgramacionSemanalComponent } from './produccion/listado-programacion-semanal/listado-programacion-semanal.component';
import { ModalMaterialesRequeridosComponent } from './produccion/listado-programacion-semanal/modal-materiales-requeridos/modal-materiales-requeridos.component';
import { ModalListadoVersionesComponent } from './produccion/listado-programacion-semanal/modal-listado-versiones/modal-listado-versiones.component';
import { VistaVersionesComponent } from './produccion/vista-versiones/vista-versiones.component';
import { RegistroProduccionComponent } from './produccion/registro-produccion/registro-produccion.component';
import { ListadoRegistroProgramacionProduccionComponent } from './produccion/listado-registro-programacion-produccion/listado-registro-programacion-produccion.component';
import { ModalPagosComponent } from './ventas/cotizaciones/modal-pagos/modal-pagos.component';
import { RegistroMenuProduccionComponent } from './produccion/registro-menu-produccion/registro-menu-produccion.component';
import { FormatoMezclaComponent } from './produccion/registro-menu-produccion/formatos-postes/formato-mezcla/formato-mezcla.component';
import { FormatoEstructuraComponent } from './produccion/registro-menu-produccion/formatos-postes/formato-estructura/formato-estructura.component';
import { FormatoTubosPinesComponent } from './produccion/registro-menu-produccion/formatos-postes/formato-tubos-pines/formato-tubos-pines.component';
import { FormatoCentrifugadoComponent } from './produccion/registro-menu-produccion/formatos-postes/formato-centrifugado/formato-centrifugado.component';
import { FormatoDesencrofadoComponent } from './produccion/registro-menu-produccion/formatos-postes/formato-desencrofado/formato-desencrofado.component';
import { FormatoCuradoComponent } from './produccion/registro-menu-produccion/formatos-postes/formato-curado/formato-curado.component';
import { FormatoMezclasComponent } from './produccion/registro-menu-produccion/formatos-accesorios/formato-mezclas/formato-mezclas.component';
import { FormatoArmadoComponent } from './produccion/registro-menu-produccion/formatos-accesorios/formato-armado/formato-armado.component';
import { FormatoAcabadoComponent } from './produccion/registro-menu-produccion/formatos-accesorios/formato-acabado/formato-acabado.component';
import { FormatoVibracionComponent } from './produccion/registro-menu-produccion/formatos-accesorios/formato-vibracion/formato-vibracion.component';
import { VisorInventarioMensualComponent } from './produccion/visor-inventario-mensual/visor-inventario-mensual.component';
import { ModalFormatosComponent } from './produccion/listado-registro-programacion-produccion/modal-formatos/modal-formatos.component';
import { ListadoOrdenesTrabajoComponent } from './produccion/listado-ordenes-trabajo/listado-ordenes-trabajo.component';
import { ModalAvanceComponent } from './produccion/listado-ordenes-trabajo/modal-avance/modal-avance.component';
import { ProtocoloPruebaCalidadComponent } from './produccion/protocolo-prueba-calidad/protocolo-prueba-calidad.component';
import { ModalDatosCartaCalidadComponent } from './produccion/listado-ordenes-trabajo/modal-datos-carta-calidad/modal-datos-carta-calidad.component';
import { ModalDatosActaConformidadComponent } from './produccion/listado-ordenes-trabajo/modal-datos-acta-conformidad/modal-datos-acta-conformidad.component';
import { ListadoProtocoloPruebaComponent } from './produccion/listado-protocolo-prueba/listado-protocolo-prueba.component';
import { RegistroFormularioComponent } from './despacho/registro-formulario/registro-formulario.component';
import { ListadoFormularioComponent } from './despacho/listado-formulario/listado-formulario.component';

registerLocaleData(localeES);

const routes: Routes = [

  //Despacho
  { path: 'despacho/listado-formulario', component: ListadoFormularioComponent, pathMatch: 'full', data: {title: 'Listado de formularios', menu: 'Despacho | Listado de formularios'} },
  { path: 'despacho/registro-formulario', redirectTo: 'despacho/registro-formulario/0', pathMatch: 'full', data: {title: 'Detalle de formulario', menu: 'Despacho | Detalle de formulario'} },
  { path: 'despacho/registro-formulario/:id', component: RegistroFormularioComponent, pathMatch: 'full', data: {title: 'Detalle de formulario', menu: 'Despacho | Detalle de formulario'} },
  
  //Producción
  { path: 'produccion/listado-protocolo-prueba', component: ListadoProtocoloPruebaComponent, pathMatch: 'full', data: {title: 'Listado de Protocolo de Prueba de Calidad', menu: 'Producción | Listado de Protocolo de Prueba de Calidad'} },
  { path: 'produccion/protocolo-prueba', redirectTo: 'produccion/protocolo-prueba/0', pathMatch: 'full', data: {title: 'Protocolo de Prueba de Calidad', menu: 'Producción | Protocolo de Prueba de Calidad'} },
  { path: 'produccion/protocolo-prueba/:id', component: ProtocoloPruebaCalidadComponent, pathMatch: 'full', data: {title: 'Protocolo de Prueba de Calidad', menu: 'Producción | Protocolo de Prueba de Calidad'} },
  { path: 'produccion/ordenes-pedido', component: ListadoOrdenesTrabajoComponent, pathMatch: 'full', data: {title: 'Listado de órdenes de trabajo', menu: 'Producción | Listado de órdenes de trabajo'} },
  { path: 'produccion/inventario-mensual', component: VisorInventarioMensualComponent, pathMatch: 'full', data: {title: 'Inventario Mensual', menu: 'Producción | Inventario Mensual'} },
  { path: 'produccion/formato/accesorios/mezcla', component: FormatoMezclasComponent, pathMatch: 'full', data: {title: 'Formato de Mezcla', menu: 'Producción | Accesorios | Formato de Mezcla'} },
  { path: 'produccion/formato/accesorios/armado', component: FormatoArmadoComponent, pathMatch: 'full', data: {title: 'Formato de Armado', menu: 'Producción | Accesorios | Formato de Armado'} },
  { path: 'produccion/formato/accesorios/acabado', component: FormatoAcabadoComponent, pathMatch: 'full', data: {title: 'Formato de Acabado', menu: 'Producción | Accesorios | Formato de Acabado'} },
  { path: 'produccion/formato/accesorios/vibracion', component: FormatoVibracionComponent, pathMatch: 'full', data: {title: 'Formato de Vibración', menu: 'Producción | Accesorios | Formato de Vibración'} },
  { path: 'produccion/formato/postes/mezcla', component: FormatoMezclaComponent, pathMatch: 'full', data: {title: 'Formato de Mezcla', menu: 'Producción | Postes | Formato de Mezcla'} },
  { path: 'produccion/formato/postes/estructura', component: FormatoEstructuraComponent, pathMatch: 'full', data: {title: 'Formato de Estructura', menu: 'Producción | Postes | Formato de Estructura'} },
  { path: 'produccion/formato/postes/tubos-pines', component: FormatoTubosPinesComponent, pathMatch: 'full', data: {title: 'Formato de Tubos y pines', menu: 'Producción  | Postes| Formato de Tubos y pines'} },
  { path: 'produccion/formato/postes/centrifugado', component: FormatoCentrifugadoComponent, pathMatch: 'full', data: {title: 'Formato de Centrifugado', menu: 'Producción | Postes | Formato de Centrifugado'} },
  { path: 'produccion/formato/postes/desencrofado', component: FormatoDesencrofadoComponent, pathMatch: 'full', data: {title: 'Formato de Desencrofado', menu: 'Producción | Postes | Formato de Desencrofado'} },
  { path: 'produccion/formato/postes/curado', component: FormatoCuradoComponent, pathMatch: 'full', data: {title: 'Formato de Curado', menu: 'Producción | Postes | Formato de Curado'} },
  { path: 'produccion/menu-produccion', component: RegistroMenuProduccionComponent, pathMatch: 'full', data: {title: 'Menú de producción', menu: 'Producción | Menú de producción'} },
  { path: 'produccion/registro-produccion-postes/listado', component: ListadoRegistroProgramacionProduccionComponent, pathMatch: 'full', data: {title: 'Registro de Producción de Postes', menu: 'Producción | Registro de Producción de Postes'} },
  { path: 'produccion/registro-produccion-postes', component: RegistroProduccionComponent, pathMatch: 'full', data: {title: 'Registro de Producción de Postes', menu: 'Producción | Registro de Producción de Postes'} },
  { path: 'produccion/visor/programacion-semanal/version/:id', component: VistaVersionesComponent, pathMatch: 'full', data: {title: 'Programación Semanal', menu: 'Producción | Programación Semanal'} },
  { path: 'produccion/programacion-semanal/listado', component: ListadoProgramacionSemanalComponent, pathMatch: 'full', data: {title: 'Programación Semanal', menu: 'Producción | Listado Programación Semanal'} },
  { path: 'produccion/programacion-semanal/detalle', redirectTo: 'produccion/programacion-semanal/detalle/0', pathMatch: 'full', data: {title: 'Programación Semanal', menu: 'Producción | Programación Semanal'} },
  { path: 'produccion/programacion-semanal/detalle/:id', component: ProgramacionProduccionSemanalComponent, pathMatch: 'full', data: {title: 'Programación Semanal', menu: 'Producción | Programación Semanal'} },

  //Ventas
  { path: 'ventas/cotizacion', component: CotizacionesComponent, pathMatch: 'full', data: {title: 'Listado de Cotizaciones', menu: 'Ventas | Listado de Cotizaciones'} },
  { path: 'ventas/cotizacion/detalle', redirectTo: 'cotizacion/detalle/0', pathMatch: 'full', data: {title: 'Detalle de Cotización', menu: 'Ventas | Detalle de Cotización'} },
  { path: 'ventas/cotizacion/detalle/:id', component: CotizacionesDetalleComponent, pathMatch: 'full', data: {title: 'Detalle de Cotización', menu: 'Ventas | Detalle de Cotización'} },
  
  //Seguridad
  { path: 'seguridad', component: ReporteActosComponent, pathMatch: 'full', data: {title: 'Listado de Reportes', menu: 'Seguridad y salud del trabajo | Listado de Reportes'} },
  { path: 'seguridad/registro', redirectTo: 'seguridad/registro/0', pathMatch: 'full', data: {title: 'Registro de Reporte', menu: 'Seguridad y salud del trabajo | Registro de Reporte'} },
  { path: 'seguridad/registro/:id', component: RegistroReporteActosComponent, pathMatch: 'full', data: {title: 'Registro de Reporte', menu: 'Seguridad y salud del trabajo | Registro de Reporte'} },
  
  //Talento Humano
  { path: 'empleado/detalle', redirectTo: 'empleado/detalle/0', pathMatch: 'full', data: {title: 'Detalle de personal', menu: 'Talento Humano | Detalle de personal'} },
  { path: 'empleado/detalle/:id', component: EmpleadoDetalleComponent, pathMatch: 'full', data: {title: 'Detalle de personal', menu: 'Talento Humano | Detalle de personal'} },
  { path: 'empleado', component: MaestroEmpleadoComponent, pathMatch: 'full', data: {title: 'Listado de personal', menu: 'Talento Humano | Listado de personal'}},

  //Seguridad
  { path: 'user/reestablecerPassword/:token', component: ResetPasswordComponent, pathMatch: 'full', data: {title: 'Reestablecimiento de contraseña', menu: 'Perfil | Reestablecimiento de contraseña'} },
  { path: 'users', component: MaestroUsuariosComponent, pathMatch: 'full', data: {title: 'Listado de usuarios', menu: 'Tec. de la Información | Listado de usuarios'} },
  { path: 'login', component: LoginComponent, pathMatch: 'full', data: {title: 'Login', menu: 'Seguridad | Login'}},
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
    MaestroEmpleadoComponent,
    EmpleadoDetalleComponent,
    ModalAgregarAuxiliarComponent,
    ModalHijosEmpleadoComponent,
    ModalRegistroVacacionesComponent,
    ModalRegistroPermisosComponent,
    ModalRegistroCesesComponent,
    ModalListadoVacacionesComponent,
    ModalListadoPermisosComponent,
    ModalRegistrarContratoComponent,
    ModalMostrarContratoComponent,
    ModalRegistrarAsistenciaComponent,
    ModalRegistroHorarioComponent,
    CotizacionesComponent,
    CotizacionesDetalleComponent,
    AlmacenComponent,
    MaestroRequerimientoCompraComponent,
    RegistroRequerimientoCompraComponent,
    ReporteActosComponent,
    RegistroReporteActosComponent,
    ModalAgregarActoCondicionComponent,
    ModalAgregarContactoClienteComponent,
    ModalRegistroDespachosComponent,
    ModalRegistroProductosDespachosComponent,
    ProgramacionProduccionSemanalComponent,
    ListadoProgramacionSemanalComponent,
    ModalMaterialesRequeridosComponent,
    ModalListadoVersionesComponent,
    VistaVersionesComponent,
    RegistroProduccionComponent,
    ListadoRegistroProgramacionProduccionComponent,
    ModalPagosComponent,
    RegistroMenuProduccionComponent,
    FormatoMezclaComponent,
    FormatoEstructuraComponent,
    FormatoTubosPinesComponent,
    FormatoCentrifugadoComponent,
    FormatoDesencrofadoComponent,
    FormatoCuradoComponent,
    FormatoMezclasComponent,
    FormatoArmadoComponent,
    FormatoAcabadoComponent,
    FormatoVibracionComponent,
    VisorInventarioMensualComponent,
    ModalFormatosComponent,
    ListadoOrdenesTrabajoComponent,
    ModalAvanceComponent,
    ProtocoloPruebaCalidadComponent,
    ModalDatosCartaCalidadComponent,
    ModalDatosActaConformidadComponent,
    ListadoProtocoloPruebaComponent,
    RegistroFormularioComponent,
    ListadoFormularioComponent,
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
    MultiSelectModule,
    ColorPickerModule,
    InputTextareaModule,
    CardModule,
    ToastModule,
    TableModule,
    InputNumberModule,
    ScrollingModule,
    DynamicDialogModule,
    FormsModule,
    HttpClientModule,
    ContextMenuModule,
    RouterModule.forRoot(routes, {
      scrollPositionRestoration: 'top'
    })
  ],
  providers: [
    MessageService,
    DialogService,
    DatePipe,
    { provide: LOCALE_ID, useValue: 'es' },
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }
