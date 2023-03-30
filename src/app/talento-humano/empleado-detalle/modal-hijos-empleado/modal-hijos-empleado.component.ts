import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { FuncionesComunesService } from 'src/app/commons/funciones-comunes.service';
import { HijoEmpleado } from '../../models/hijo-empleado';

@Component({
  selector: 'app-modal-hijos-empleado',
  templateUrl: './modal-hijos-empleado.component.html',
  styleUrls: ['./modal-hijos-empleado.component.css']
})
export class ModalHijosEmpleadoComponent implements OnInit {

  hijos: HijoEmpleado[] = [];
  hijoAux: HijoEmpleado;

  blnEditandoCreando: boolean = false;
  indFilaEditada: number = -1;

  constructor(
    private ref: DynamicDialogRef,
    private config: DynamicDialogConfig,
    private funcionesComunes: FuncionesComunesService,
    private pipe: DatePipe
  ) { }

  ngOnInit(): void {

    this.config.data.hijos.forEach(h => {
      h.fechaNacimientoStr = this.pipe.transform(h.fechaNacimiento, 'dd MMM yyyy')
    })

    this.hijos = this.config.data.hijos;

    this.hijos.forEach(e => {
      e.edad = this.funcionesComunes.calcularEdad(this.pipe.transform(e.fechaNacimiento, 'yyyy-mm-dd'))
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

    this.ref.close(this.hijos);
  }

  setEdad(i) {
    this.hijos[i].fechaNacimiento = new Date(this.hijos[i].fechaNacimientoStr)
    this.hijos[i].edad = this.funcionesComunes.calcularEdad(this.pipe.transform(this.hijos[i].fechaNacimiento, 'yyyy-MM-dd'))
    
  }

}
