import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { FuncionesComunesService } from 'src/app/commons/funciones-comunes.service';
import { HijoEmpleado } from '../../models/hijo-empleado';
import { TablaAuxiliarDetalle } from 'src/app/auxiliar/models/tabla-auxiliar-detalle';
import { AuxiliarService } from 'src/app/auxiliar/auxiliar.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-modal-hijos-empleado',
  templateUrl: './modal-hijos-empleado.component.html',
  styleUrls: ['./modal-hijos-empleado.component.css']
})
export class ModalHijosEmpleadoComponent implements OnInit {

  hijos: HijoEmpleado[] = [];
  hijoAux: HijoEmpleado;

  tiposDocumento: TablaAuxiliarDetalle[];

  blnEditandoCreando: boolean = false;
  indFilaEditada: number = -1;

  constructor(
    private ref: DynamicDialogRef,
    private config: DynamicDialogConfig,
    private funcionesComunes: FuncionesComunesService,
    private auxiliarService: AuxiliarService,
    private pipe: DatePipe,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {

    this.auxiliarService.getListSelect('TIPDOC').subscribe({
      next: res => {
        this.tiposDocumento = res
      }, error: err => {
        if(err.status == 409) {
          this.messageService.add({severity:'warn', summary:'Advertencia', detail:err.error.mensaje});
        } else {
          this.messageService.add({severity:'error', summary:'Error', detail: 'Error por parte del servidor.'});
        }
      }
    })

    this.hijos = this.config.data.hijos;

    this.hijos.forEach(h => {
      h.fechaNacimientoStr = this.pipe.transform(h.fechaNacimiento, 'dd MMM yyyy')
      h.edad = this.funcionesComunes.calcularEdad(this.pipe.transform(h.fechaNacimiento, 'yyyy-mm-dd'))
    })
  }

  close() {
    this.ref.close();
  }

  addHijo() {
    this.hijos.unshift(new HijoEmpleado())
  }

  quitar(i: number) {
    this.hijos = this.hijos.filter((l,h)=> {h != i});
  }


  asignarHijos() {
    this.hijos.forEach( h => {
      h.fechaNacimiento = new Date(h.fechaNacimientoStr);
    })
    console.log(this.hijos)

    this.ref.close(this.hijos);
  }

  setEdad(i) {
    this.hijos[i].fechaNacimiento = new Date(this.hijos[i].fechaNacimientoStr)
    this.hijos[i].edad = this.funcionesComunes.calcularEdad(this.pipe.transform(this.hijos[i].fechaNacimiento, 'yyyy-MM-dd'))
    
  }

}
