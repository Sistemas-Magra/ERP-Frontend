import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { FuncionesComunesService } from 'src/app/commons/funciones-comunes.service';
import { AuthService } from 'src/app/seguridad/auth.service';
import { EmpleadoService } from '../../empleado.service';

@Component({
  selector: 'app-modal-registro-vacaciones',
  templateUrl: './modal-registro-vacaciones.component.html',
  styleUrls: ['./modal-registro-vacaciones.component.css']
})
export class ModalRegistroVacacionesComponent implements OnInit {

  vacacionesTotal: number;
  vacacionesConsumidas: number;
  vacacionesDisponibles: number;

  fechaInicio: Date;
  fechaFin: Date;

  fechaInicioStr: string;
  fechaFinStr: string;

  tiempoVacaciones: number;

  blnCargando: boolean = false;

  constructor(
    private ref: DynamicDialogRef,
    private config: DynamicDialogConfig,
    private funcionesComunes: FuncionesComunesService,
    private messageService: MessageService,
    private pipe: DatePipe,
    private empleadoService: EmpleadoService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.fechaInicio = new Date();
    this.fechaFin = new Date();

    this.tiempoVacaciones = this.funcionesComunes.diasEntreFechas(this.fechaInicio, this.fechaFin)

    this.vacacionesTotal = this.config.data.vacAcumulada;
    this.vacacionesConsumidas = this.config.data.vacOcupado;
    this.vacacionesDisponibles = this.config.data.vacDisponible;

  }

  calcularDiasVacaciones() {
    this.tiempoVacaciones = this.funcionesComunes.diasEntreFechas(this.fechaInicio, this.fechaFin)
  }

  close() {
    this.ref.close();
  }

  guardar() {

    if(!this.fechaInicio) {
      this.messageService.add({severity:'warn', summary:'Advertencia', detail:'Debe ingresar la fecha de inicio de vacaciones.'});
      return;
    }

    if(!this.fechaFin) {
      this.messageService.add({severity:'warn', summary:'Advertencia', detail:'Debe ingresar la fecha fin de vacaciones.'});
      return;
    }

    if(this.tiempoVacaciones > this.vacacionesDisponibles) {
      this.messageService.add({severity:'warn', summary:'Advertencia', detail:'El tiempo de vacaciones solicitadas es mayor al tiempo de vacaciones restantes del personal seleccionado.'});
      return;
    }

    this.fechaInicioStr = this.pipe.transform(this.fechaInicio, 'yyyy-MM-dd');
    this.fechaFinStr = this.pipe.transform(this.fechaFin, 'yyyy-MM-dd');

    this.blnCargando = true;
    this.empleadoService.registrarVacaciones(this.fechaInicioStr, this.fechaFinStr, this.config.data.id, this.tiempoVacaciones, this.authService.usuario.id).subscribe({
      next: res => {
        this.blnCargando = false;
        this.messageService.add({severity:'success', summary:'Éxito', detail:'Vacaciones registradas correctamente.'})
        this.ref.close();
      }, error: err => {
        this.blnCargando = false;
        if(err.status == 409) {            
          this.messageService.add({severity:'warn', summary:'Advertencia', detail: err.error.mensaje});
        } else {
          this.messageService.add({severity:'error', summary:'Error', detail:'Error al registrar vacaciones.'})
        }
      }
    })
  }

}
