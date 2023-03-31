import { Component, OnInit } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ParametroService } from 'src/app/auxiliar/parametro.service';
import { ContratoService } from '../../contrato.service';
import { Contrato } from '../../models/contrato';
import { forkJoin } from 'rxjs';
import { VacacionService } from '../../vacacion.service';

@Component({
  selector: 'app-modal-mostrar-contrato',
  templateUrl: './modal-mostrar-contrato.component.html',
  styleUrls: ['./modal-mostrar-contrato.component.css']
})
export class ModalMostrarContratoComponent implements OnInit {

  contrato: Contrato = new Contrato();

  porcAsignacionFamiliar: number;
  sueldoMinimo: number;

  diasVacacionesMes: number;

  totalAfecto: number = 0;
  descuento: number = 0;

  constructor(
    private ref: DynamicDialogRef,
    private config: DynamicDialogConfig,
    private parametroService: ParametroService,
    private contratoService: ContratoService,
    private vacacionService: VacacionService
  ) { }

  ngOnInit(): void {
    
    let fork = forkJoin(
      this.contratoService.getContratoByEmpleado(this.config.data.id),
      this.parametroService.getParametroById(1),
      this.parametroService.getParametroById(2),
      this.vacacionService.getByUserId(this.config.data.id)
    )

    fork.subscribe(res => {
      this.porcAsignacionFamiliar = +res[1].valor;
      this.sueldoMinimo = +res[2].valor;
      this.contrato = res[0];

      let listadoVacacionesMes
      
      this.totalAfecto = this.contrato.sueldo + this.contrato.empleado.vacacionesDisponibles + (this.contrato.indAsignacionFamiliar?this.sueldoMinimo*this.porcAsignacionFamiliar/10:0)
      this.descuento = this.contrato?.empleado?.entidadFondos?.aporte*this.totalAfecto/100 + this.contrato?.empleado?.entidadFondos?.comision*this.totalAfecto/100 + this.contrato?.empleado?.entidadFondos?.prima*this.totalAfecto/100
    })
  }

  close() {
    this.ref.close();
  }

}
