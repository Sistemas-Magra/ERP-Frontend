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
    this.fechaInicioStr = this.pipe.transform(this.fechaInicio, 'yyyy-MM-dd');
    this.fechaFinStr = this.pipe.transform(this.fechaFin, 'yyyy-MM-dd');

    this.empleadoService.registrarVacaciones(this.fechaInicioStr, this.fechaFinStr, this.config.data.id, this.tiempoVacaciones, this.authService.usuario.id).subscribe({
      next: res => {
        this.messageService.add({severity:'warn', summary:'Advertencia', detail:'Debe seleccionar un tipo de documento de identidad.'})
        this.ref.close();
      }
    })
  }

}
