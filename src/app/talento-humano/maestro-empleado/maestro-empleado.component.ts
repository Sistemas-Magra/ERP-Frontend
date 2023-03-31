import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LazyLoadEvent, MenuItem, MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ModalSiNoComponent } from 'src/app/commons/modal-si-no/modal-si-no.component';
import { ModalListadoPermisosComponent } from './modal-listado-permisos/modal-listado-permisos.component';
import { ModalListadoVacacionesComponent } from './modal-listado-vacaciones/modal-listado-vacaciones.component';
import { ModalRegistroCesesComponent } from './modal-registro-ceses/modal-registro-ceses.component';
import { ModalRegistroPermisosComponent } from './modal-registro-permisos/modal-registro-permisos.component';
import { ModalRegistroVacacionesComponent } from './modal-registro-vacaciones/modal-registro-vacaciones.component';
import { EmpleadoService } from '../empleado.service';
import { ModalRegistrarContratoComponent } from './modal-registrar-contrato/modal-registrar-contrato.component';

@Component({
  selector: 'app-maestro-empleado',
  templateUrl: './maestro-empleado.component.html',
  styleUrls: ['./maestro-empleado.component.css']
})
export class MaestroEmpleadoComponent implements OnInit {

  empleados: any[] = [];
  blnEditandoCreando: boolean = false;
  blnCargando: boolean = false;
  indFilaEditada: number = -1;

  nombreFilter: string;
  nroDocFilter: string;
  fechas: Date[] = [];
  fechaDesdeFilter: string;
  fechaHastaFilter: string;
  indVerInactivosFilter: boolean = false;

  totalRecords: number;
  first: number;
  page: number = 0;

  optionsRc: MenuItem[];
  rowSelected: any;

  ref: DynamicDialogRef

  constructor(
    private empleadoService: EmpleadoService,
    private pipe: DatePipe,
    private dialogService: DialogService,
    private messageService: MessageService,
    private router: Router
  ) { }

  ngOnInit(): void {

    this.optionsRc = [
      {label: 'Ingresar a Planilla', icon: 'pi pi-fw pi-pencil', command: () => this.registrarContrato(this.rowSelected)},
      {label: 'Condición Usuario', icon: 'pi pi-fw pi-user', command: () => this.condicionarUsuario(this.rowSelected)},
      {label: 'Cesar Personal', icon: 'pi pi-fw pi-times', command: () => this.registrarCese(this.rowSelected)},
      {label: 'Ver listado de Permisos', icon: 'pi pi-fw pi-search', command: () => this.verPermisos(this.rowSelected)},
      {label: 'Registrar Permiso', icon: 'pi pi-fw pi-plus', command: () => this.registrarPermisos(this.rowSelected)},
      {label: 'Ver listado de Vacaciones', icon: 'pi pi-fw pi-search', command: () => this.verVacaciones(this.rowSelected)},
      {label: 'Registrar Vacaciones', icon: 'pi pi-fw pi-plus', command: () => this.registrarVacaciones(this.rowSelected)}
    ]

    this.fechaHastaFilter = this.pipe.transform(new Date(), 'yyyy-MM-dd')
    this.fechaDesdeFilter = this.pipe.transform(new Date((Number(this.fechaHastaFilter.split('-')[0]) - 2) + '/' + this.fechaHastaFilter.split('-')[1] + '/' + this.fechaHastaFilter.split('-')[2]), 'yyyy-MM-dd')

    this.fechas.push(new Date(this.fechaDesdeFilter))
    this.fechas.push(new Date(this.fechaHastaFilter))

    this.empleadoService.listadoEmpleado(
      this.nombreFilter, this.nroDocFilter, this.fechaDesdeFilter, this.fechaHastaFilter,
      this.indVerInactivosFilter?1:0,
      this.page, 30
    ).subscribe({
      next: res2 => {
        this.totalRecords = res2[0].total;
        this.empleados = res2;
      }
    })
  }

  registrarContrato(emp: any) {
    
    this.ref = this.dialogService.open(ModalRegistrarContratoComponent, {
      data: {
        id: emp.id
      },
      width:'1000px',
      height: '400px'
    })
  }

  verVacaciones(emp: any) {
    this.ref = this.dialogService.open(ModalListadoVacacionesComponent, {
      data: {
        id: emp.id
      },
      width:'550px',
      height: '400px'
    })
  }

  verPermisos(emp: any) {
    this.ref = this.dialogService.open(ModalListadoPermisosComponent, {
      data: {
        id: emp.id
      },
      width:'550px',
      height: '400px'
    })
  }

  registrarCese(emp: any) {
    this.ref = this.dialogService.open(ModalRegistroCesesComponent, {
      data: {
        id: emp.id
      },
      width:'650px',
      height: '400px'
    })
  }

  registrarPermisos(emp: any) {
    this.ref = this.dialogService.open(ModalRegistroPermisosComponent, {
      data: {
        id: emp.id
      },
      width:'750px',
      height: '310px'
    })
  }

  registrarVacaciones(emp: any) {
    this.ref = this.dialogService.open(ModalRegistroVacacionesComponent, {
      data: {
        vacDisponible: emp.vacaciones_disponibles,
        vacOcupado: emp.vacaciones_ocupadas,
        vacAcumulada: emp.vacaciones_acumuladas,
        id: emp.id
      },
      width:'750px',
      height: '270px'
    })
  }

  condicionarUsuario(emp: any) {
    let strTitulo: string = (emp.estado_id == 0)?'Reactivar':'Deshabilitar';
    let str: string = (emp.estado_id == 0)?'habilitar':'deshabilitar';
    this.ref = this.dialogService.open(ModalSiNoComponent,{
      data:{
        titulo: `${strTitulo} de Personal`,
        texto: `¿Está seguro(a) que desea ${str} al personal ${emp.nombre_completo}?`,
        botonAceptacion: 'Sí',
        botonDeclinacion: 'No'
      },
      width:'500px',
      height: '170px'
    })

    this.ref.onClose.subscribe(res => {
      if(res.res == 1) {
        let refmodal = this.dialogService.open(ModalSiNoComponent,{
          data:{
            titulo: `${strTitulo} de Usuario`,
            texto: `¿Desea ${str} al usuario asignado de ${emp.nombre_completo}?`,
            botonAceptacion: 'Sí',
            botonDeclinacion: 'No'
          }, width:'500px',
          height: '170px'
        })

        refmodal.onClose.subscribe(res2 => {
          this.empleadoService.updateCondicion(emp.id, res2.res, (emp.estado_id == 0?1:0)).subscribe({
            next: response => {
              this.messageService.add({severity:'success', summary:'Éxito', detail:'Personal actualizado correctamente.'})
              
              this.empleadoService.listadoEmpleado(
                this.nombreFilter, this.nroDocFilter, this.fechaDesdeFilter, this.fechaHastaFilter,
                this.indVerInactivosFilter?1:0,
                this.page, 30
              ).subscribe({
                next: res4 => {
                  this.totalRecords = res4[0].total;
                  this.empleados = res4;
                }
              })
            }
          })
        })
      }
    })
  }

  loadEmpleados(event: LazyLoadEvent) {
    this.first = event.first;

    this.page = this.first/30

    this.empleadoService.listadoEmpleado(
      this.nombreFilter, this.nroDocFilter, this.fechaDesdeFilter, this.fechaHastaFilter,
      this.indVerInactivosFilter?1:0,
      this.page, 30
    ).subscribe({
      next: res => {
        if(res.length > 0) {
          this.totalRecords = res[0].total;
          this.empleados = res;
        } else {
          this.totalRecords = 0;
          this.empleados = res
        }
      }
    })
  }

  asignarFechas() {
    this.fechaDesdeFilter = this.pipe.transform(this.fechas[0], 'yyyy-MM-dd');
    this.fechaHastaFilter = this.pipe.transform(this.fechas[1], 'yyyy-MM-dd');

    this.empleadoService.listadoEmpleado(
      this.nombreFilter, this.nroDocFilter, this.fechaDesdeFilter, this.fechaHastaFilter,
      this.indVerInactivosFilter?1:0,
      this.page, 30
    ).subscribe({
      next: res2 => {
        if(res2.length > 0) {
          this.totalRecords = res2[0].total;
          this.empleados = res2;
        } else {
          this.totalRecords = 0;
          this.empleados = res2
        }
      }
    })
  }

  nuevo() {
    this.router.navigate(['/empleado/detalle/0'])
  }

  irDetalle(emp: any) {
    this.router.navigate([`/empleado/detalle/${emp.id}`])
  }

}
